import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client'; // Asegurate que Role esté exportado

export class SyncUserDto {
  @IsString()
  auth0Id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // opcional, se asigna automáticamente USER si no se especifica
}
