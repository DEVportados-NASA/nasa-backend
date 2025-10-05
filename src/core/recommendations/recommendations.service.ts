import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Recommendation} from "./recommendations.entity";
import {MoreThan, Repository} from "typeorm";
import {OpenAI} from "openai";
import {CreateRecommendationDto} from "./create-recommendation.dto";
import {CitiesService} from "../cities/cities.service";
import {plainToInstance} from "class-transformer";
import {RecommendationResponseDto} from "./recommendation-response.dto";
import {validate} from "class-validator";

@Injectable()
export class RecommendationsService {
  private client: OpenAI;

  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    private citiesService: CitiesService,
  ) {
    this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async create(createRecommendationDto: CreateRecommendationDto) {
    const city = await this.citiesService.findByName(createRecommendationDto.city);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const recommendation = await this.recommendationRepository.findOne({
      where: {
        date: createRecommendationDto.date,
        city: city,
        createdAt: MoreThan(oneYearAgo)
      }
    });

    if (recommendation) {
      return { recommendation };
    } else {
      const prompt = `Tengo la siguiente información del clima:
        ${JSON.stringify(createRecommendationDto)}
        Basado en esta información:
        1. Dame **5 recomendaciones totales** en una sola lista en inglés:
          - Las 3 primeras deben ser actividades para hacer en la ciudad.
          - Las 2 últimas deben ser consejos o advertencias sobre el clima.
        2. Devuelve **solo** el formato JSON en texto para poder parsearlo con esta estructura exacta un objeto (recomendaciones que sea una lista de 5 strings):
          {
            "recommendations": [
              "Recomendación 1",
              "Recomendación 2",
              "Recomendación 3",
              "Recomendación 4",
              "Recomendación 5"
            ]
          }
       3. IMPORTANTE: No uses etiquetas de formato como \`\`\`json o \`\`\`.
         Solo devuelve el JSON puro, sin texto adicional. `
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

        const recommendationResponseDto = plainToInstance(RecommendationResponseDto, parsed);

        const errors = await validate(recommendationResponseDto);
        if (errors.length > 0) {
          throw new InternalServerErrorException({
            message: ['Error en la petición (El JSON no cumple con la estructura esperada).'],
            error: 'Internal Server Error',
            statusCode: 500
          });
        }

        const [first, second, third, fourth, fifth] = recommendationResponseDto.recommendations;

        const recommendationToCreate = this.recommendationRepository.create({
          firstRecommendation: first,
          secondRecommendation: second,
          thirdRecommendation: third,
          fourthRecommendation: fourth,
          fifthRecommendation: fifth,
          date: createRecommendationDto.date,
          city: city,
        });
        await this.recommendationRepository.save(recommendationToCreate);

        return {
          recommendation: {
            firstRecommendation: first,
            secondRecommendation: second,
            thirdRecommendation: third,
            fourthRecommendation: fourth,
            fifthRecommendation: fifth
          }
        };
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
