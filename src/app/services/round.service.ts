import { Injectable } from '@angular/core';
import { DiceService } from './dice.service';
import { RoundResult } from '../models/round-result.model';
import { DiceSet } from '../models/diceSet.model';
import { BetService } from './bet.service';
import { PlayersService } from './players.service';

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
        ? this.players.nbActivePlayers - 1
        : activePlayerIndex - 1;
    const allDice = dices.map((diceSet) => diceSet.dice);
    const valueToCheck = this.diceManager.getValueToCheck(allDice);

    this.setResult(trigger, valueToCheck, activePlayerIndex, opponentIndex);
    this.players.endRoundConsequence(this.roundResult);
  }

  setFirstPlayer(): void {
    // add case player has no dice
    let firstPlayer = 0;

    if (this.roundResult) {
      firstPlayer =
        this.roundResult.roundLoser !== -1
          ? this.roundResult.roundLoser
          : this.roundResult.roundWinner;
    }
    if (!this.diceManager.getDiceForPlayer(firstPlayer)) {
      firstPlayer =
        (this.players.getCurrentPlayerIndex() + 1) %
        this.players.nbActivePlayers;
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
      loser = hasActivePlayerWon ? opponentIndex : activePlayerIndex;
      winner = -1;
    } else {
      hasActivePlayerWon =
        valueToCheck[`${this.bet.getFaceValue()}`] === this.bet.getDiceAmount(); // if true, the player who called exact wins

      loser = hasActivePlayerWon ? -1 : activePlayerIndex;
      winner = hasActivePlayerWon ? activePlayerIndex : -1;
    }

    this.roundResult = {
      diceAmount: valueToCheck[this.bet.getFaceValue()],
      faceValue: this.bet.getFaceValue(),
      roundLoser: loser,
      roundWinner: winner,
    };
  }
}
