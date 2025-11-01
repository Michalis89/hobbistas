import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

/**
 * Data Transfer Object για user registration.
 * Χρησιμοποιεί class-validator decorators για validation.
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Παρακαλώ δώσε ένα έγκυρο email' })
  @IsNotEmpty({ message: 'Το email είναι υποχρεωτικό' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Το password πρέπει να έχει τουλάχιστον 8 χαρακτήρες' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Το password πρέπει να περιέχει κεφαλαία, πεζά, και αριθμούς',
  })
  @IsNotEmpty({ message: 'Το password είναι υποχρεωτικό' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Το όνομα χρήστη είναι υποχρεωτικό' })
  @MinLength(3, { message: 'Το όνομα χρήστη πρέπει να έχει τουλάχιστον 3 χαρακτήρες' })
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'Το όνομα χρήστη μπορεί να περιέχει μόνο πεζά γράμματα, αριθμούς, _ και -',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Το display name είναι υποχρεωτικό' })
  @MinLength(2, { message: 'Το display name πρέπει να έχει τουλάχιστον 2 χαρακτήρες' })
  displayName: string;

  @IsString()
  bio?: string; // Optional
}
