import {IsDate, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRecommendationDto {
  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  @ApiProperty({ example: 'Los Angeles' })
  city: string;

  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  @IsDate({ message: 'La fecha debe ser correcta.' })
  @ApiProperty({ example: '2023-02-15T00:00:00.000Z' })
  @Type(() => Date)
  date: Date;

  @IsNotEmpty({ message: 'La temperatura máxima es obligatoria.' })
  @IsNumber({}, { message: "La temperatura máxima debe ser un número." })
  @ApiProperty({ example: 13.24 })
  @Type(() => Number)
  max_temperature: number;

  @IsNotEmpty({ message: 'La temperatura mínima es obligatoria.' })
  @IsNumber({}, { message: "La temperatura mínima debe ser un número." })
  @ApiProperty({ example: 2.81 })
  @Type(() => Number)
  min_temperature: number;

  @IsNotEmpty({ message: 'La temperatura promedio es obligatoria.' })
  @IsNumber({}, { message: "La temperatura promedio debe ser un número." })
  @ApiProperty({ example: 7.3 })
  @Type(() => Number)
  average_temperature: number;

  @IsNotEmpty({ message: 'La probabilidad de lluvia es obligatoria.' })
  @IsNumber({}, { message: "La probabilidad de lluvia debe ser un número." })
  @ApiProperty({ example: 0.01 })
  @Type(() => Number)
  rain_probability_percentage: number;

  @IsNotEmpty({ message: 'El porcentaje de nubes es obligatoria.' })
  @IsNumber({}, { message: "El porcentaje de nubes debe ser un número." })
  @ApiProperty({ example: 0.78 })
  @Type(() => Number)
  cloud_cover_percentage: number;
}
