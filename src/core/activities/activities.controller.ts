import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ActivitiesService} from "./activities.service";
import {CreateCityDto} from "../cities/create-city.dto";

@Controller('activities')
export class ActivitiesController {

  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCityDto: CreateCityDto) {
    return this.activitiesService.create(createCityDto);
  }

  @Get(':name')
  getCityByName(@Param('name') name: string) {
    return this.activitiesService.findByName(name);
  }

  @Get()
  getAll() {
    return this.activitiesService.findAll();
  }
}
