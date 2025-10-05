import {ArrayMinSize, IsArray, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateActivityRecommendationDto {
  @IsArray({ message: 'Las actividades son obligatorias.' })
  @IsString({ each: true, message: 'Las actividades deben ser cadenas de texto.' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos una actividad.' })
  @ApiProperty({ example: ['Running', 'Hiking'] })
  activities: string[];
}
