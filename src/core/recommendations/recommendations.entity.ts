import {
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {City} from "../cities/cities.entity";

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  firstRecommendation: string;

  @Column()
  secondRecommendation: string;

  @Column()
  thirdRecommendation: string;

  @Column()
  fourthRecommendation: string;

  @Column()
  fifthRecommendation: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => City)
  city: City;
}