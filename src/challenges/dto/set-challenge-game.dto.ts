import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interface/player.interface';
import { Result } from '../interface/challenge.interface';

export class SetChallengeToAGame {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
