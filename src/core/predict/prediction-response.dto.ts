import {IsNumber} from 'class-validator';

export class PredictionResponseDto {
  @IsNumber()
  max_temperature: number;

  @IsNumber()
  min_temperature: number;

  @IsNumber()
  average_temperature: number;

  @IsNumber()
  rain_probability_percentage: number;

  @IsNumber()
  cloud_cover_percentage: number;
}
