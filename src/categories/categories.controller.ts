import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interface/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategoryService(
      createCategoryDto,
    );
  }

  @Get()
  async getCategories(
    @Query() params: string[],
  ): Promise<Category[] | Category> {
    const idCategory = params['idCategory'];
    const idPlayer = params['idPlayer'];

    if (idCategory) {
      return await this.categoriesService.getCategoryByNameService(idCategory);
    }
    if (idPlayer) {
      return await this.categoriesService.getPlayerCategoryService(idPlayer);
    }
    return await this.categoriesService.getAllCategoriesService();
  }

  // @Get()
  // async getCategories(): Promise<Array<Category>> {
  //   return await this.categoriesService.getAllCategoriesService();
  // }

  // @Get('/:category')
  // @UsePipes(ValidationPipe)
  // async getCategoryByName(
  //   @Param('category') category: string,
  // ): Promise<Category> {
  //   return await this.categoriesService.getCategoryByNameService(category);
  // }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<void> {
    await this.categoriesService.updateCategoryService(
      category,
      updateCategoryDto,
    );
  }

  @Post('/:category/players/:idPlayer')
  async addPlayerToACategory(@Param() params: string[]): Promise<void> {
    await this.categoriesService.addPlayerToACategoryService(params);
  }
}
