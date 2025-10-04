import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {PredictService} from "./predict.service";
import {GetPredictionDto} from "./getPrediction.dto";

@Controller('predict')
export class PredictController {

  constructor(private readonly predictService: PredictService) {}

  @Get('test-basic')
  async testBasic() {
    return this.predictService.testPythonBasic();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async predictWeather(@Body() getPredictionDto: GetPredictionDto) {
    return this.predictService.getPrediction(getPredictionDto);
  }
}
