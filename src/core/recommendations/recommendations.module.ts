import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Recommendation} from "./recommendations.entity";
import {City} from "../cities/cities.entity";
import {CitiesService} from "../cities/cities.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, City]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, CitiesService]
})
export class RecommendationsModule {}
