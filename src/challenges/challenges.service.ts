import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenges.dto';
import { SetChallengeToAGame } from './dto/set-challenge-game.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatus } from './interface/challenge-status.enum';
import { Challenge, Game } from './interface/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallengeService(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const allPlayers = await this.playersService.getAllPlayersService();

    createChallengeDto.players.map((playerDto) => {
      const filteredPlayer = allPlayers.filter(
        (player) => player._id == playerDto._id,
      );
      if (filteredPlayer.length === 0) {
        throw new BadRequestException(`${playerDto._id} is not a player!`);
      }
    });

    const isRequesterAPlayerOfThisGame =
      await createChallengeDto.players.filter(
        (player) => player._id == createChallengeDto.requester,
      );

    if (isRequesterAPlayerOfThisGame.length === 0) {
      throw new BadRequestException(`requester must be a player of this game!`);
    }

    const playerCategory =
      await this.categoriesService.getPlayerCategoryService(
        createChallengeDto.requester,
      );

    if (!playerCategory) {
      throw new BadRequestException(`requester needs to be in the category!`);
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = playerCategory.category;
    createdChallenge.dateTimeRequest = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);

    return await createdChallenge.save();
  }

  //requester???

  async getAllChallengesService(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('game')
      .exec();
  }

  async getChallengesOfAPlayerService(_id: any): Promise<Challenge[]> {
    const foundPlayer = await this.playersService.getPlayerByIdService(_id);

    if (foundPlayer) {
      return await this.challengeModel
        .find()
        .where('players')
        .in(_id)
        .populate('requester')
        .populate('players')
        .populate('game')
        .exec();
    }
  }

  async updateChallengeService(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new NotFoundException(`Challenge ${_id} not found!`);
    }

    if (updateChallengeDto.status) {
      foundChallenge.dateTimeResponse = new Date();
    }

    foundChallenge.status = updateChallengeDto.status;
    foundChallenge.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }

  async setChallengeToAGameService(
    _id: string,
    setChallengeToAGameDto: SetChallengeToAGame,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found`);
    }

    const filteredPlayer = foundChallenge.players.filter(
      (player) => player._id == setChallengeToAGameDto.def,
    );

    this.logger.log(`foundChallenge: ${foundChallenge}`);
    this.logger.log(`filteredPlayer: ${filteredPlayer}`);

    if (filteredPlayer.length === 0) {
      throw new BadRequestException(`Winner does not belong to this game!`);
    }

    const gameSet = new this.gameModel(setChallengeToAGameDto);
    gameSet.category = foundChallenge.category;
    gameSet.players = foundChallenge.players;

    const result = await gameSet.save();
    foundChallenge.status = ChallengeStatus.DONE;

    foundChallenge.game = result._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: foundChallenge })
        .exec();
    } catch (error) {
      await this.gameModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallengeService(_id: string): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found`);
    }

    foundChallenge.status = ChallengeStatus.CANCELED;
    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: { foundChallenge } })
      .exec();
  }
}
