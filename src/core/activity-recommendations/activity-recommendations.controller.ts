import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ActivityRecommendationsService} from "./activity-recommendations.service";
import {CreateActivityRecommendationDto} from "./create-activity-recommendation.dto";

@Controller('activity-recommendations')
export class ActivityRecommendationsController {

  constructor(private readonly activityRecommendationsService: ActivityRecommendationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createActivityRecommendationDto: CreateActivityRecommendationDto) {
    return this.activityRecommendationsService.create(createActivityRecommendationDto);
  }
}
