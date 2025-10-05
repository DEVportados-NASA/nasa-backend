import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Activity} from "./activities.entity";
import {Repository} from "typeorm";
import {CreateActivityDto} from "./create-activity.dto";

@Injectable()
export class ActivitiesService {

  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const activity = await this.activityRepository.findOne({
      where: {
        name: createActivityDto.name,
      }
    });
    if (activity) {
      throw new BadRequestException({
        message: ['Actividad ya existe.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    const activityToCreate = this.activityRepository.create({
      name: createActivityDto.name,
    });
    return this.activityRepository.save(activityToCreate);
  }

  async findByName(name: string) {
    const activity = await this.activityRepository.findOne({
      where: {
        name: name,
      }
    });
    if (!activity) {
      throw new BadRequestException({
        message: ['Actividad no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      })
    }

    return activity;
  }

  async findAll() {
    const activities = await this.activityRepository.find();
    return { activities };
  }
}
