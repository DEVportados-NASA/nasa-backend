import { Module } from '@nestjs/common';
import { PredictController } from './predict.controller';
import { PredictService } from './predict.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {City} from "../cities/cities.entity";
import {Prediction} from "./prediction.entity";
import {CitiesService} from "../cities/cities.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction, City]),
  ],
  controllers: [PredictController],
  providers: [PredictService, CitiesService]
})
export class PredictModule {}
