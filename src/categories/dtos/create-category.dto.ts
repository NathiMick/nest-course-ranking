import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Event } from '../interface/category.interface';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
