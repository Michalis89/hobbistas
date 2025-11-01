import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface που περιγράφει το user object που επιστρέφεται από το JWT strategy.
 */
export interface UserFromToken {
  id: string;
  email: string;
  username: string;
  displayName: string;
  roles: string[];
  avatarUrl?: string;
}

/**
 * GetUser Decorator
 *
 * Custom parameter decorator που extract-άρει το user object από το request.
 * Το user object προστίθεται στο request από το JwtStrategy validation.
 *
 * @example
 * \@UseGuards(JwtAuthGuard)
 * \@Get('me')
 * getCurrentUser(@GetUser() user: UserFromToken) {
 *   return user;
 * }
 *
 * @example
 * // Get specific property
 * \@Get('my-id')
 * getMyId(@GetUser('id') userId: string) {
 *   return { userId };
 * }
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserFromToken | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Αν specify-άρεις ένα property name, επέστρεψε μόνο αυτό
    if (data) {
      return user?.[data];
    }

    // Αλλιώς επέστρεψε το whole user object
    return user;
  },
);
