import { Module } from '@nestjs/common';
import { ActivityRecommendationsController } from './activity-recommendations.controller';
import { ActivityRecommendationsService } from './activity-recommendations.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ActivityRecommendation} from "./activity-recommendations.entity";
import {Activity} from "../activities/activities.entity";
import {City} from "../cities/cities.entity";
import {ActivitiesService} from "../activities/activities.service";
import {CitiesService} from "../cities/cities.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityRecommendation, Activity, City]),
  ],
  controllers: [ActivityRecommendationsController],
  providers: [ActivityRecommendationsService, ActivitiesService, CitiesService]
})
export class ActivityRecommendationsModule {}
