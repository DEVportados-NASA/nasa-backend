import {
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {ActivityRecommendationItem} from "./activity-recommendation-item.entity";

@Entity()
export class ActivityRecommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cacheKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ActivityRecommendationItem, item => item.activityRecommendation, { cascade: true })
  items: ActivityRecommendationItem[];
}