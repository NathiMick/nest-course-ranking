import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interface/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategoryService(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const foundCategory = await this.categoryModel.findOne({ category }).exec();
    if (foundCategory) {
      throw new BadRequestException(`Category ${category} already exist`);
    }
    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  async getAllCategoriesService(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryByNameService(category: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec();
    if (!foundCategory) {
      throw new NotFoundException(`Category ${category} not found`);
    }
    return foundCategory;
  }

  async updateCategoryService(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (!foundCategory) {
      throw new NotFoundException(`Category ${category} not found`);
    }
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async getPlayerCategoryService(idPlayer: any): Promise<Category> {
    const foundPlayer = await this.playerService.getPlayerByIdService(idPlayer);

    if (foundPlayer) {
      return await this.categoryModel
        .findOne()
        .where('players')
        .in(idPlayer)
        .exec();
    }
  }

  async addPlayerToACategoryService(params: string[]): Promise<void> {
    const categoryParams = params['category'];
    const idPlayerParams = params['idPlayer'];

    const foundCategory = await this.categoryModel
      .findOne({ categoryParams })
      .exec();

    const playerAlreadyAddedToCategory = await this.categoryModel
      .find({ categoryParams })
      .where('players')
      .in(idPlayerParams);

    await this.playerService.getPlayerByIdService(idPlayerParams);

    if (!foundCategory) {
      throw new BadRequestException(
        `Category ${categoryParams} does not exist`,
      );
    }

    if (playerAlreadyAddedToCategory.length > 0) {
      throw new BadRequestException(
        `Player ${idPlayerParams} already exist in category ${categoryParams}`,
      );
    }

    foundCategory.players.push(idPlayerParams);
    await this.categoryModel
      .findOneAndUpdate({ categoryParams }, { $set: foundCategory })
      .exec();
  }
}
