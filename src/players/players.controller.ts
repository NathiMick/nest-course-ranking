import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player-dto';
import { UpdatePlayerDto } from './dtos/update-player-dto';
import { Player } from './interface/player.interface';
import { ValidationPipeClass } from '../common/pipes/validation.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayerController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playerService.createPlayerService(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidationPipeClass) _id: string,
  ): Promise<void> {
    await this.playerService.updatePlayerService(_id, updatePlayerDto);
  }

  // @Get()
  // async getPlayers(): Promise<Player[]> {
  //   return this.playerService.getAllPlayersService();
  // }

  // @Get('/:_id')
  // async getPlayerById(
  //   @Param('_id', ValidationPipeClass) _id: string,
  // ): Promise<Player> {
  //   return this.playerService.getPlayerByIdService(_id);
  // }

  @Get()
  async getPlayers(@Query('idPlayer') _id: string): Promise<Player[] | Player> {
    if (_id) {
      return await this.playerService.getPlayerByIdService(_id);
    }
    return await this.playerService.getAllPlayersService();
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationPipeClass) _id: string,
  ): Promise<void> {
    this.playerService.deletePlayerService(_id);
  }
}
