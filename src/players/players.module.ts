import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interface/player.schema';
import { PlayerController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  controllers: [PlayerController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
