import { ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { Event } from '../interface/category.interface';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  description: string;

  @ArrayMinSize(1)
  events: Array<Event>;
}
