import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GameSetting } from './gameSetting.service';
import { RoundService } from './round.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bet } from '../models/bet.model';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  currentBetSubject!: BehaviorSubject<Bet>;
  currentBet$!: Observable<Bet>;

  constructor(private settings: GameSetting) {
    this.currentBetSubject = new BehaviorSubject({
      diceAmount: 0,
      faceValue: 0,
    });
    this.currentBet$ = this.currentBetSubject.asObservable();
  }

  getBet(): Bet {
    return this.currentBetSubject.value;
  }

  getDiceAmount(): number {
    return this.currentBetSubject.value.diceAmount;
  }

  getFaceValue(): number {
    return this.currentBetSubject.value.faceValue;
  }

  setNewBet(diceAmount: number, faceValue: number): void {
    const bet = { diceAmount, faceValue };
    this.currentBetSubject.next(bet);
  }
  increaseNbDice(diceAmount: number): number {
    return diceAmount + 1;
  }
  decreaseNBdice(diceAmount: number, faceValue: number): number {
    if (
      diceAmount <= 1 ||
      (diceAmount <= this.getDiceAmount() && faceValue === 1)
    ) {
      return diceAmount;
    } else if (
      (diceAmount <= this.getDiceAmount() && faceValue !== 1) ||
      (this.getFaceValue() === 1 && diceAmount <= this.getDiceAmount() * 2 + 1)
    ) {
      return Math.ceil(this.getDiceAmount() / 2);
    } else {
      return diceAmount - 1;
    }
  }

  increaseFaceValue(faceValue: number, diceAmount: number): Bet {
    if (
      faceValue === 1 &&
      this.getFaceValue() === 1 &&
      diceAmount < this.getDiceAmount() * 2 + 1
    ) {
      return {
        faceValue: faceValue + 1,
        diceAmount: this.getDiceAmount() * 2 + 1,
      };
    } else if (faceValue === 1 && diceAmount < this.getDiceAmount()) {
      return { faceValue: faceValue + 1, diceAmount: this.getDiceAmount() };
    } else if (faceValue >= this.settings.nbFacePerDice) {
      return { faceValue: this.settings.nbFacePerDice, diceAmount };
    }
    return { faceValue: faceValue + 1, diceAmount };
  }
  decreaseFaceValue(faceValue: number): number {
    if (faceValue === 2 && this.currentBetSubject.value.faceValue === 0) {
      return 2;
    }
    if (faceValue > 1) {
      return faceValue - 1;
    }
    return 1;
  }

  reset(): void {
    this.currentBetSubject.next({ diceAmount: 0, faceValue: 0 });
  }

  hydrateBet(currentBet: Bet): void {
    this.currentBetSubject = new BehaviorSubject<Bet>(currentBet);
    this.currentBet$ = this.currentBetSubject.asObservable();
  }
  getDataToSave(): Bet {
    return this.getBet();
  }
}
