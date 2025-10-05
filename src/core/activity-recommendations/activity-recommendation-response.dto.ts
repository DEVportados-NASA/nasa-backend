import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";

export class ActivityRecommendationResponseDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActivityRecommendationItemDto)
  items: ActivityRecommendationItemDto[];
}

export class ActivityRecommendationItemDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  reason: string;

  @IsNotEmpty()
  @IsNumber()
  ranking: number;
}