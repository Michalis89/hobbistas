import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 *
 * Χρησιμοποίησε αυτό το decorator για να mark-άρεις ένα route ως public (χωρίς auth).
 *
 * @example
 * \@Public()
 * \@Get('hello')
 * sayHello() {
 *   return { message: 'Hello World!' };
 * }
 */
export const Public = () => SetMetadata('isPublic', true);
