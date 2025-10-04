import {ArrayMaxSize, ArrayMinSize, IsArray, IsString} from 'class-validator';

export class RecommendationResponseDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  recommendations: string[];
}
