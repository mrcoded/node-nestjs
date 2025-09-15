import { IsDateString, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class CreateDestinatonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  travelDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
