import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interface/challenge-status.enum';

export class ChallengeStatusValidacaoPipe implements PipeTransform {
  readonly acceptedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is not a valid status`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.acceptedStatus.indexOf(status);
    return idx !== -1;
  }
}
