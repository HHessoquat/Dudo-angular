import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { DiceService } from './dice.service';
import { RoundService } from './round.service';
import { BetService } from './bet.service';
import { PlayersService } from './players.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  endRound!: boolean;
  endGameSubject!: BehaviorSubject<boolean>;
  endGame$!: Observable<boolean>;

  constructor(
    private diceManager: DiceService,
    private roundManager: RoundService,
    private currentBet: BetService,
    private players: PlayersService,
  ) {}
  initGame(): void {
    this.endRound = false;
    this.players.setPlayers();
    this.players.setActivePlayers();
    this.initEndGameObservable();
    this.initRound();
  }
  initRound(): void {
    this.players.initRound();
    this.diceManager.hideAllDices();
    this.diceManager.rollDice(this.players.getActivePlayers());
    this.diceManager.setNbDice(this.players.getActivePlayers());
    this.roundManager.setFirstPlayer();
  }
  resolveRound(trigger: 'dudo' | 'exact') {
    this.roundManager.resolveRound(trigger, this.diceManager.getAllDice());
    this.diceManager.showAllDices();
    this.endRound = true;

  }
  nextRound(): void {
    this.roundManager.initRound();
    this.endGameSubject.next(this.players.getActivePlayers().length <= 1);
    console.log('end game', this.endGameSubject.value);

    if (this.endGameSubject.value) {
      return;
    }

    this.endRound = false;
    this.initRound();
  }

  initEndGameObservable(): void {
    if (!this.endGameSubject) {
      this.endGameSubject = new BehaviorSubject(
        this.players.getActivePlayers().length <= 1
      );
      this.endGame$ = this.endGameSubject.asObservable();
      return;
    }
    this.endGameSubject.next(false);
  }
  setCurrentBet(diceAmount: number, faceValue: number): void {
    this.currentBet.setNewBet(diceAmount, faceValue);
    this.players
      .getActivePlayers()
      [this.players.getCurrentPlayerIndex()].lastBetSubject.next({
        diceAmount,
        faceValue,
      });
  }

  hydrateGame(endRound: boolean): void {
    this.endRound = endRound;
    this.initEndGameObservable();
  }
  getDataToSave(): object {
    return {
      endRound: this.endRound,
    };
  }

  reset():void {
    this.endRound = false;
    this.endGameSubject.next(false);
  }
}
