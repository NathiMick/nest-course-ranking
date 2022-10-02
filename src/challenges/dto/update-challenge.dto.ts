import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interface/challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  dateTimeChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;
}
