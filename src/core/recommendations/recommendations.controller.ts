import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {RecommendationsService} from "./recommendations.service";
import {CreateRecommendationDto} from "./create-recommendation.dto";

@Controller('recommendations')
export class RecommendationsController {

  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }
}
