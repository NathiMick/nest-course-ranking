import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player-dto';
import { Player } from './interface/player.interface';
// import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player-dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async updatePlayerService(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player ${_id} not found`);
    }
    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async createPlayerService(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      throw new BadRequestException(`Player ${email} already exist`);
    }
    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async getPlayerByIdService(_id: string): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();
    if (!playerFound) {
      throw new NotFoundException(`Player ${_id} not found`);
    }
    return playerFound;
  }

  async getAllPlayersService(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async deletePlayerService(_id: string): Promise<any> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player ${_id} not found`);
    }

    return await this.playerModel.deleteOne({ _id }).exec();
  }
}
