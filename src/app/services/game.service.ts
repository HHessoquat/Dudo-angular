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
    private players: PlayersService
  ) {}
  initGame(): void {
    this.endRound = false;
    this.players.setPlayers();
    this.players.setActivePlayers(this.players.getAllPlayers());
    this.endGameSubject = new BehaviorSubject(
      this.players.getActivePlayers().length <= 1
    );
    this.endGame$ = this.endGameSubject.asObservable();
  }
  initRound(): void {
    this.players.initRound();
    this.diceManager.rollDice(this.players.getActivePlayers());
    this.diceManager.setNbDice(this.players.getActivePlayers());
    this.roundManager.setFirstPlayer();
  }
  resolveRound(trigger: 'dudo' | 'exact') {
    this.roundManager.resolveRound(trigger, this.diceManager.getAllDice());
    this.endRound = true;
    console.log('end game', this.endGameSubject.value);
  }
  nextRound(): void {
    this.roundManager.initRound();
    this.endGameSubject.next(this.players.getActivePlayers().length <= 1);
    if (this.endGameSubject.value) {
      return;
    }
    this.initRound();
    this.endRound = false;
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
  }
  getDataToSave(): object {
    return {
      endRound: this.endRound,
    };
  }
}
