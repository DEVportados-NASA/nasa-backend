import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {CitiesService} from "./cities.service";
import {CreateCityDto} from "./create-city.dto";

@Controller('cities')
export class CitiesController {

  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get(':name')
  getBranchByUserId(@Param('name') name: string) {
    return this.citiesService.findByName(name);
  }
}
