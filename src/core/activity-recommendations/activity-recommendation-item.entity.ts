import {
    Column,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {ActivityRecommendation} from "./activity-recommendations.entity";

@Entity()
export class ActivityRecommendationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  reason: string;

  @Column()
  ranking: number;

  @ManyToOne(() => ActivityRecommendation)
  activityRecommendation: ActivityRecommendation;
}