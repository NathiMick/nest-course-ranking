import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenges.dto';
import { SetChallengeToAGame } from './dto/set-challenge-game.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interface/challenge.interface';
import { ChallengeStatusValidacaoPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengesService.createChallengeService(
      createChallengeDto,
    );
  }

  @Get()
  async getChallenges(@Query('idPlayer') _id: string): Promise<Challenge[]> {
    return _id
      ? await this.challengesService.getChallengesOfAPlayerService(_id)
      : await this.challengesService.getAllChallengesService();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidacaoPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallengeService(
      _id,
      updateChallengeDto,
    );
  }

  @Post('/:challenge/game')
  async setChallengeToAGame(
    @Body(ValidationPipe) setChallengeToAGameDto: SetChallengeToAGame,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.setChallengeToAGameService(
      _id,
      setChallengeToAGameDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallengeService(_id);
  }
}
