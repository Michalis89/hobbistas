import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT Authentication Guard.
 *
 * Extend-άρει το default AuthGuard από Passport.
 * Χρησιμοποίησε αυτό το guard σε routes που χρειάζονται authentication.
 *
 * @example
 * \@UseGuards(JwtAuthGuard)
 * \@Get('profile')
 * getProfile(@GetUser() user: UserFromToken) {
 *   return user;
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Override το canActivate για να support-άρουμε optional authentication.
   * Αν ένα route έχει @Public() decorator, δεν θα require authentication.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check αν το route είναι marked ως public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip authentication
    }

    // Default behavior - require authentication
    return super.canActivate(context);
  }
}
