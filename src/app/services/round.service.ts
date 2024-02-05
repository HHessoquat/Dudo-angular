import { Injectable } from '@angular/core';
import { DiceService } from './dice.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bet } from '../models/bet.model';
import { Dice } from '../models/dice.model';
import { GameSetting } from './gameSetting.service';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  nbPlayer!: number;
  activePlayerSubject!: BehaviorSubject<number>;
  activePlayer$!: Observable<number>;
  currentBetSubject!: BehaviorSubject<Bet>;
  currentBet$!: Observable<Bet>;
  loser!: number;

  constructor(private settings: GameSetting, private diceManager: DiceService) {
    this.nbPlayer = this.settings.nbPlayer;
    this.activePlayerSubject = new BehaviorSubject<number>(0);
    this.activePlayer$ = this.activePlayerSubject.asObservable();
    this.currentBetSubject = new BehaviorSubject({
      diceAmount: 0,
      faceValue: 0,
    });
    this.currentBet$ = this.currentBetSubject.asObservable();
  }
  initRound() {
    this.activePlayerSubject.next(this.loser);
    this.currentBetSubject.next({ diceAmount: 0, faceValue: 0 });
  }

  resolveRound(trigger: 'dudo' | 'exact', dices: Dice[][]) {
    const diceResult = this.diceManager.reduceDiceValue(dices);
    console.log(diceResult);
    const valueToCheck = this.diceManager.getValueToCheck(diceResult);
    console.log(valueToCheck);
    let betResult;
    if (trigger === 'dudo') {
      betResult =
        valueToCheck[`${this.currentBetSubject.value.faceValue}`] >=
        this.currentBetSubject.value.diceAmount; // if true, the player who called dudo loses
      this.loser = betResult
        ? this.activePlayerSubject.value
        : this.activePlayerSubject.value - 1;
    } else if ((trigger = 'exact')) {
      betResult =
        valueToCheck[`${this.currentBetSubject.value.faceValue}`] ===
        this.currentBetSubject.value.diceAmount; // if true, the player who called exact wins
      this.loser = this.activePlayerSubject.value;
    }

    console.log('face', this.currentBetSubject.value.faceValue);
    console.log('amount', this.currentBetSubject.value.diceAmount);
    console.log(betResult);
    return betResult;
  }

  setCurrentBet(diceAmount: number, faceValue: number): void {
    const bet = { diceAmount, faceValue };
    this.currentBetSubject.next(bet);
  }

  nextPlayer(): void {
    const currentIndex = this.activePlayerSubject.value;
    const nextIndex = (currentIndex + 1) % this.nbPlayer;
    this.activePlayerSubject.next(nextIndex);
  }

  hydrateRound(activePlayerSubject: number, currentBet: Bet) {
    this.nbPlayer = this.settings.nbPlayer;
    this.activePlayerSubject = new BehaviorSubject<number>(activePlayerSubject);
    this.activePlayer$ = this.activePlayerSubject.asObservable();
    this.currentBetSubject = new BehaviorSubject<Bet>(currentBet);
    this.currentBet$ = this.currentBetSubject.asObservable();
  }
  getDataToSave(): object {
    return {
      activePlayerSubject: this.activePlayerSubject.value,
      currentBetSubject: this.currentBetSubject.value,
    };
  }
}
