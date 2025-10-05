import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {City} from "./cities.entity";
import {CreateCityDto} from "./create-city.dto";

@Injectable()
export class CitiesService {

  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const city = await this.cityRepository.findOne({
      where: {
        name: createCityDto.name,
      }
    });
    if (city) {
      throw new BadRequestException({
        message: ['Ciudad ya existe.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const cityToCreate = this.cityRepository.create({
      name: createCityDto.name,
    });
    return this.cityRepository.save(cityToCreate);
  }

  async findByName(name: string) {
    const city = await this.cityRepository.findOne({
      where: {
        name: name,
      }
    });
    if (!city) {
      throw new NotFoundException({
        message: ['Ciudad no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return city;
  }

  async findAll() {
    const cities = await this.cityRepository.find();
    return { cities };
  }
}
