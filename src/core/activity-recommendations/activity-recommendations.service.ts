import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {OpenAI} from "openai";
import {InjectRepository} from "@nestjs/typeorm";
import {ActivityRecommendation} from "./activity-recommendations.entity";
import {MoreThan, Repository} from "typeorm";
import {ActivitiesService} from "../activities/activities.service";
import {CitiesService} from "../cities/cities.service";
import {CreateActivityRecommendationDto} from "./create-activity-recommendation.dto";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ActivityRecommendationResponseDto} from "./activity-recommendation-response.dto";

@Injectable()
export class ActivityRecommendationsService {
  private client: OpenAI;

  constructor(
    @InjectRepository(ActivityRecommendation)
    private activityRecommendationRepository: Repository<ActivityRecommendation>,
    private activitiesService: ActivitiesService,
    private citiesService: CitiesService,
  ) {
    this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async create(createActivityRecommendationDto: CreateActivityRecommendationDto) {
    let activitiesNames: string[] = [];
    for (const activity of createActivityRecommendationDto.activities) {
        const activityFromDB = await this.activitiesService.findByName(activity);
        activitiesNames.push(activityFromDB.name);
    }

    const cities = await this.citiesService.findAllToService();
    let citiesNames = cities.map(city => city.name);

    const cacheKey = `${activitiesNames.sort().join('-')}|${citiesNames.sort().join('-')}`;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activityRecommendation = await this.activityRecommendationRepository.findOne({
      where: {
        cacheKey: cacheKey,
        createdAt: MoreThan(oneYearAgo)
      },
      relations: ['items']
    });

    if (activityRecommendation) {
      return { activityRecommendation };
    } else {
      const prompt = `Actividades: ${activitiesNames.join(', ')}
        Ciudades: ${citiesNames.join(', ')}
        Filtra las ciudades donde se pueden realizar esas actividades considerando clima y geografía.
        Luego ordénalas de la más recomendable a la menos, y explica por qué.
        Devuelve solo JSON con el formato:
        {
          "items": [
            { "city": "nombre", "reason": "texto breve", "ranking": número }
          ]
        }
        IMPORTANTE: No uses etiquetas de formato como \`\`\`json o \`\`\`.
        Solo devuelve el JSON puro, sin texto adicional.`
      ;

      const completion = await this.client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
        temperature: 0.8
      });

      const output = completion.output[0];
      if ('content' in output && output.content && 'text' in output.content[0]) {
        const text = output.content[0].text;
        let parsed: any;

        try {
            parsed = JSON.parse(text);
        } catch (error) {
          throw new InternalServerErrorException({
            message: ['Error en la petición (Hubo error al parsear el JSON).'],
            error: 'Internal Server Error',
            statusCode: 500
          });
        }

        const activityRecommendationResponseDto = plainToInstance(ActivityRecommendationResponseDto, parsed);

        const errors = await validate(activityRecommendationResponseDto);
        if (errors.length > 0) {
            throw new InternalServerErrorException({
                message: ['Error en la petición (El JSON no cumple con la estructura esperada).'],
                error: 'Internal Server Error',
                statusCode: 500
            });
        }

        const activityRecommendationToCreate = this.activityRecommendationRepository.create({
          cacheKey: cacheKey,
          items: activityRecommendationResponseDto.items.map(itemDto => ({
            city: itemDto.city,
            reason: itemDto.reason,
            ranking: itemDto.ranking,
          }))
        });
        await this.activityRecommendationRepository.save(activityRecommendationToCreate);

        return { activityRecommendation: activityRecommendationResponseDto };
      } else {
        throw new InternalServerErrorException({
          message: ['Error en la petición (No hubo respuesta de OpenAI).'],
          error: 'Internal Server Error',
          statusCode: 500
        });
      }
    }
  }
}
