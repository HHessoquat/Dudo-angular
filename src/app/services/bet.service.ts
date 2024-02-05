import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GameSetting } from './gameSetting.service';
import { RoundService } from './round.service';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  constructor(
    private game: GameService,
    private settings: GameSetting,
    private round: RoundService
  ) {}

  increaseNbDice(diceAmount: number): number {
    return diceAmount + 1;
  }
  decreaseNBdice(diceAmount: number, faceValue: number): number {
    if (
      diceAmount <= 1 ||
      (diceAmount <= this.round.currentBetSubject.value.diceAmount &&
        faceValue === 1)
    ) {
      return diceAmount;
    } else if (
      diceAmount <= this.round.currentBetSubject.value.diceAmount &&
      faceValue !== 1
    ) {
      return Math.floor(diceAmount / 2) + 1;
    } else {
      return diceAmount - 1;
    }
  }

  increaseFaceValue(faceValue: number): number {
    if (faceValue >= this.settings.nbFacePerDice) {
      return this.settings.nbFacePerDice;
    }
    return faceValue + 1;
  }
  decreaseFaceValue(faceValue: number): number {
    if (faceValue === 2 && this.round.currentBetSubject.value.faceValue === 0) {
      return 2;
    }
    if (faceValue > 1) {
      return faceValue - 1;
    }
    return 1;
  }
}
