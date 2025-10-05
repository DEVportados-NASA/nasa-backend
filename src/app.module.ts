import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './core/recommendations/recommendations.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { CitiesModule } from './core/cities/cities.module';
import { PredictModule } from './core/predict/predict.module';
import { ActivitiesModule } from './core/activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  RecommendationsModule,
  CitiesModule,
  PredictModule,
  ActivitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
