import { Injectable } from '@angular/core';
import { DiceService } from './dice.service';
import { RoundResult } from '../models/round-result.model';
import { DiceSet } from '../models/diceSet.model';
import { BetService } from './bet.service';
import { PlayersService } from './players.service';
import {Player} from "../entities/player.entity";

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  roundResult!: RoundResult;

  constructor(
    private diceManager: DiceService,
    private bet: BetService,
    private players: PlayersService
  ) {}
  initRound() {
    this.bet.reset();
  }

  resolveRound(trigger: 'dudo' | 'exact', dices: DiceSet[]): void {
    const activePlayerIndex: number = this.players.getCurrentPlayerIndex();
    const opponentIndex: number =
      activePlayerIndex === 0
        ? this.players.getActivePlayers().length - 1
        : activePlayerIndex - 1;
    const allDice = dices.map((diceSet) => diceSet.dice);
    const valueToCheck = this.diceManager.getValueToCheck(allDice);

    this.setResult(trigger, valueToCheck, activePlayerIndex, opponentIndex);
    this.players.endRoundConsequence(this.roundResult);
  }

  setFirstPlayer(): void {
    if (!this.roundResult) {
      this.players.setActivePlayerIndex(0);
      return;
    }

    let firstPlayer = 0;

    const lastWinnerOrLoserId = this.roundResult.roundLoserId !== -1
      ? this.roundResult.roundLoserId
      : this.roundResult.roundWinnerId
    firstPlayer = this.players.getActivePlayers()
      .findIndex((player: Player) => player.id === lastWinnerOrLoserId);

    if (firstPlayer === -1) {
      firstPlayer = this.players.getCurrentPlayerIndex() - 1 >= 0
        ? this.players.getCurrentPlayerIndex() - 1
        : 0;
    }

    this.players.setActivePlayerIndex(firstPlayer);
  }
  setResult(
    trigger: string,
    valueToCheck: any,
    activePlayerIndex: number,
    opponentIndex: number
  ): void {
    let loser: number;
    let winner: number;
    let hasActivePlayerWon: boolean;
    if (trigger === 'dudo') {
      hasActivePlayerWon =
        valueToCheck[`${this.bet.getFaceValue()}`] < this.bet.getDiceAmount(); // if true, the player who called dudo wins
      loser = hasActivePlayerWon
        ? this.players.getActivePlayers()[opponentIndex].id
        : this.players.getActivePlayers()[activePlayerIndex].id;
      winner = -1;
    } else {
      hasActivePlayerWon =
        valueToCheck[`${this.bet.getFaceValue()}`] === this.bet.getDiceAmount(); // if true, the player who called exact wins

      loser = hasActivePlayerWon ? -1 : this.players.getActivePlayers()[activePlayerIndex].id;
      winner = hasActivePlayerWon ? this.players.getActivePlayers()[activePlayerIndex].id : -1;
    }

    this.roundResult = {
      diceAmount: valueToCheck[this.bet.getFaceValue()],
      faceValue: this.bet.getFaceValue(),
      roundLoserId: loser,
      roundWinnerId: winner,
    };
  }

  getDataToSave() {
    return {
      roundResult: this.roundResult,
    };
  }

  hydrateRound(roundResult: RoundResult ):void {
    this.roundResult = roundResult;
  }

  reset():void {
    this.roundResult = {
      diceAmount: 0,
      faceValue: 0,
      roundLoserId: 0,
      roundWinnerId: -1
    };
  }
}
