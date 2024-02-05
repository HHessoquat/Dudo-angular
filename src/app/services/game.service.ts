import { Injectable } from '@angular/core';
import { GameSetting } from './gameSetting.service';
import { getPosition } from '../features/players/players';
import { Dice } from '../models/dice.model';
import { color } from '../features/dice';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { Bet } from '../models/bet.model';
import { Player } from '../entities/player.entity';
import { PlayerPosition } from '../features/players/position-types.type';
import { DiceService } from './dice.service';
import { RoundService } from './round.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  players!: Player[];
  dices!: Array<Dice>[];
  nbDice!: number;
  endRound!: boolean;

  constructor(
    private settings: GameSetting,
    private diceManager: DiceService,
    private roundManager: RoundService
  ) {}
  initGame(): void {
    const POSITION: Array<PlayerPosition> = getPosition(this.settings.nbPlayer);

    this.players = this.settings.players.map((player, index) => {
      return new Player(index, player.name, player.password, POSITION[index]);
    });
    this.nbDice = this.setNbDice();
  }
  initRound(): void {
    this.players.forEach((player) => player.resetBet());
    this.dices = this.diceManager.rollDice(this.players);
    this.endRound = true;
    this.nbDice = this.setNbDice();
    console.log(this.nbDice);
  }
  resolveRound(trigger: 'dudo' | 'exact') {
    let result = this.roundManager.resolveRound(trigger, this.dices);
    if (trigger === 'dudo') {
      this.players[
        this.roundManager.activePlayerSubject.value - (result ? 0 : 1)
      ].loseDice();
    } else if (result) {
      this.players[this.roundManager.activePlayerSubject.value].winDice();
    } else {
      this.players[this.roundManager.activePlayerSubject.value].loseDice();
    }
    this.endRound = true;
  }
  setCurrentBet(diceAmount: number, faceValue: number): void {
    this.roundManager.setCurrentBet(diceAmount, faceValue);
    this.players[
      this.roundManager.activePlayerSubject.value
    ].lastBetSubject.next({ diceAmount, faceValue });
  }

  setNbDice(): number {
    return this.players.reduce((acc, player: Player) => {
      return acc + player.nbDiceLeft;
    }, 0);
  }
  hydrateGame(
    players: Player[],
    bets: any,
    dices: Array<Dice>[],
    nbDice: number,
    endRound: boolean
  ): void {
    this.players = players.map((player) => {
      return new Player(
        player.id,
        player.name,
        player.password,
        player.position as PlayerPosition,
        player.nbDiceLeft,
        bets.diceAmount,
        bets.faceValue
      );
    });

    this.dices = dices;
    this.nbDice = nbDice;
    this.endRound = endRound;
  }
  getDataToSave(): object {
    const lastBets = this.players.map((player) => {
      return { id: player.id, bet: player.lastBetSubject.value };
    }); // this is where I remembered that "bid" would have been a better word for what I call bet
    return {
      players: this.players,
      lastBets,
      dices: this.dices,
      nbDice: this.nbDice,
      endRound: this.endRound,
    };
  }
}
