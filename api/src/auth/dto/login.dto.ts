import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object για user login.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Παρακαλώ δώσε ένα έγκυρο email' })
  @IsNotEmpty({ message: 'Το email είναι υποχρεωτικό' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Το password είναι υποχρεωτικό' })
  password: string;
}
