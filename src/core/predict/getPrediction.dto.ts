import {IsDate, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetPredictionDto {
  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  @ApiProperty({ example: 'Los Angeles' })
  city: string;

  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  @IsDate({ message: 'La fecha debe ser correcta.' })
  @ApiProperty({ example: '2023-02-15T00:00:00.000Z' })
  @Type(() => Date)
  date: Date;
}
