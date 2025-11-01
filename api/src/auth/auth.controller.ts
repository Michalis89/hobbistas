import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser, UserFromToken } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';

/**
 * Auth Controller
 *
 * Handle-άρει όλα τα authentication endpoints:
 * - POST /auth/register - User registration
 * - POST /auth/login - User login
 * - GET /auth/me - Get current user (requires auth)
 * - POST /auth/logout - User logout
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   *
   * Register έναν νέο χρήστη.
   *
   * @param registerDto - User registration data
   * @returns User object + JWT token
   *
   * @example
   * POST /api/auth/register
   * {
   *   "email": "user@example.com",
   *   "password": "StrongPass123!",
   *   "username": "johndoe",
   *   "displayName": "John Doe",
   *   "bio": "I love coding!"
   * }
   *
   * Response:
   * {
   *   "user": { ... },
   *   "access_token": "eyJhbGci...",
   *   "token_type": "Bearer",
   *   "expires_in": "7d"
   * }
   */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   *
   * Login υπάρχοντος χρήστη.
   *
   * @param loginDto - User login credentials
   * @returns User object + JWT token
   *
   * @example
   * POST /api/auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "StrongPass123!"
   * }
   *
   * Response:
   * {
   *   "user": { ... },
   *   "access_token": "eyJhbGci...",
   *   "token_type": "Bearer",
   *   "expires_in": "7d"
   * }
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // 200 instead of 201 for login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/me
   *
   * Get τα στοιχεία του currently authenticated user.
   * Requires valid JWT token στο Authorization header.
   *
   * @param user - Current user από JWT token
   * @returns Full user profile
   *
   * @example
   * GET /api/auth/me
   * Headers: { Authorization: "Bearer eyJhbGci..." }
   *
   * Response:
   * {
   *   "id": "uuid",
   *   "email": "user@example.com",
   *   "username": "johndoe",
   *   "displayName": "John Doe",
   *   ...
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@GetUser() user: UserFromToken) {
    // Το @GetUser() decorator extract-άρει το user από το request
    // που προστέθηκε από το JwtStrategy
    return this.authService.getCurrentUser(user.id);
  }

  /**
   * POST /auth/logout
   *
   * Logout του χρήστη.
   *
   * Note: Με JWT tokens, το logout γίνεται client-side
   * διαγράφοντας το token. Εδώ απλά επιστρέφουμε success message.
   *
   * Αν θέλεις real server-side logout, πρέπει να implement-άρεις:
   * - Token blacklist στη database
   * - Redis για token invalidation
   *
   * @returns Success message
   *
   * @example
   * POST /api/auth/logout
   * Headers: { Authorization: "Bearer eyJhbGci..." }
   *
   * Response:
   * {
   *   "message": "Logged out successfully"
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: UserFromToken) {
    // Optional: Μπορείς να log-άρεις το logout event
    // ή να invalidate-άρεις το token αν έχεις token blacklist

    return {
      message: 'Logged out successfully',
      userId: user.id,
    };
  }

  /**
   * PATCH /auth/profile
   *
   * Update user profile
   * Supports avatar file upload via multipart/form-data
   *
   * @param user - Current user από JWT token
   * @param updateProfileDto - Profile data to update
   * @param avatar - Avatar file (optional)
   * @returns Updated user profile
   *
   * @example
   * PATCH /api/auth/profile
   * Headers: { Authorization: "Bearer eyJhbGci..." }
   * Body (JSON):
   * {
   *   "displayName": "New Name",
   *   "bio": "New bio"
   * }
   *
   * OR with file upload (multipart/form-data):
   * {
   *   "displayName": "New Name",
   *   "bio": "New bio",
   *   "avatar": [file]
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @GetUser() user: UserFromToken,
    @Body() body: any, // Use any to accept both JSON and FormData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() avatar?: any,
  ) {
    // Create DTO from body (works for both JSON and FormData)
    const updateProfileDto: UpdateProfileDto = {
      displayName: body.displayName,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
    };

    return this.authService.updateProfile(user.id, updateProfileDto, avatar);
  }

  /**
   * GET /auth/health
   *
   * Health check endpoint για το auth module.
   * Public endpoint χωρίς authentication.
   *
   * @returns Health status
   */
  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      module: 'auth',
      timestamp: new Date().toISOString(),
    };
  }
}
