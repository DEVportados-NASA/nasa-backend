import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {exec} from "child_process";
import {promisify} from "util";
import {InjectRepository} from "@nestjs/typeorm";
import {Prediction} from "./prediction.entity";
import {MoreThan, Repository} from "typeorm";
import {GetPredictionDto} from "./getPrediction.dto";
import {CitiesService} from "../cities/cities.service";
import {plainToInstance} from "class-transformer";
import {PredictionResponseDto} from "./prediction-response.dto";
import {validate} from "class-validator";

const execAsync = promisify(exec);

@Injectable()
export class PredictService {

  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    private citiesService: CitiesService,
  ) {}

  async getPrediction(getPredictionDto: GetPredictionDto) {
    const city = await this.citiesService.findByName(getPredictionDto.city);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const prediction = await this.predictionRepository.findOne({
      where: {
        date: getPredictionDto.date,
        city: city,
        createdAt: MoreThan(oneYearAgo)
      }
    });

    if (prediction) {
      return prediction;
    } else {
      let result: any;
      try {
        const yyyy = getPredictionDto.date.getFullYear();
        const mm = String(getPredictionDto.date.getMonth() + 1).padStart(2, '0');
        const dd = String(getPredictionDto.date.getDate()).padStart(2, '0');
        const shortDate = `${yyyy}-${mm}-${dd}`;

        const { stdout } = await execAsync(`python3 predict.py ${getPredictionDto.city} ${shortDate}`);

        result = JSON.parse(stdout);
      } catch (error) {
        throw new InternalServerErrorException({
            message: ['Error en la petición (Algo pasó con el script Python).'],
            error: 'Internal Server Error',
            statusCode: 500
        });
      }

      const predictionResponseDto = plainToInstance(PredictionResponseDto, result);

      const errors = await validate(predictionResponseDto);
      if (errors.length > 0) {
        throw new InternalServerErrorException({
          message: ['Error en la petición (El JSON no cumple con la estructura esperada).'],
          error: 'Internal Server Error',
          statusCode: 500
        });
      }

      const predictionToCreate = this.predictionRepository.create({
        max_temperature: predictionResponseDto.max_temperature,
        min_temperature: predictionResponseDto.min_temperature,
        average_temperature: predictionResponseDto.average_temperature,
        rain_probability_percentage: predictionResponseDto.rain_probability_percentage,
        cloud_cover_percentage: predictionResponseDto.cloud_cover_percentage,
        date: getPredictionDto.date,
        city: city,
      });
      await this.predictionRepository.save(predictionToCreate);

      return predictionResponseDto;
    }
  }

  async testPythonBasic() {
    try {
      const { stdout } = await execAsync(`python3 test_script.py hola mundo`);

      const resultado = JSON.parse(stdout);

      return {
        resultado,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: ['Error en la petición (Algo pasó con el script Python).'],
        error: 'Internal Server Error',
        statusCode: 500
      });
    }
  }
}
