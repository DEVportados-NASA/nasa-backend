import {
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {City} from "../cities/cities.entity";

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max_temperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  min_temperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  average_temperature: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rain_probability_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cloud_cover_percentage: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => City)
  city: City;
}