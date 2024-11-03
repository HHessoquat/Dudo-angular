import { Injectable } from '@angular/core';
import { UserInput } from '../models/user-input.model';

@Injectable({
  providedIn: 'root',
})
export class GameSetting {
  gameMode!: 'solo' | 'multi' | 'multiBot';
  nbBots!: number;
  nbPlayer!: number;
  players!: UserInput[];
  showNbTotalDice!: boolean;
  showNbDiceByPlayer!: boolean;
  exactRule!: boolean;
  showLastBet!: boolean;
  nbFacePerDice: number = 6;
  nbDicePerPlayer: number = 5;

  hydrateSettings(
    gameMode: 'solo' | 'multi' | 'multiBot',
    showNbDice: boolean,
    nbPlayer: number = 1,
    players: UserInput[],
    nbBots: number = 0
  ): void {
    this.gameMode = gameMode;
    this.showNbTotalDice = showNbDice;
    this.nbPlayer = nbPlayer;
    this.players = players;
    this.nbBots = nbBots;
  }

  getAllSettings(): Object {
    return {
      gameMode: this.gameMode,
      showNbDice: this.showNbTotalDice,
      nbBots: this.nbBots,
      nbPlayer: this.nbPlayer,
      players: this.players,
    };
  }

  reset() {
    this.nbPlayer = 0;
    this.nbBots = 0;
    this.players = [];
  }
}
