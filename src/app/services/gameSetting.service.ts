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
  showLastBet!: boolean;
  exactRule!: boolean;
  firstPlayerSetsRotation!: boolean;
  openCloseRound!: boolean
  nbFacePerDice: number = 6;
  nbDicePerPlayer: number = 5;

  setMultiplayerSettings(
    players: UserInput[],
    nbPlayer: number,
    nbFacePerDice: number = 6,
    nbDicePerPlayer: number = 5,
  ): void {
    this.gameMode = 'multi';
    this.players = players;
    this.nbBots = 0;
    this.nbPlayer = nbPlayer;
    this.nbFacePerDice = nbFacePerDice;
    this.nbDicePerPlayer = nbDicePerPlayer;
  }

  private setRules(
    showNbTotalDice: boolean,
    showNbDiceByPlayer: boolean,
    exactRule: boolean,
    showLastBet: boolean,
    firstPlayerSetsRotation: boolean,
    openCloseRound: boolean
  ): void {
    this.showNbTotalDice = showNbTotalDice;
    this.showNbDiceByPlayer = showNbDiceByPlayer;
    this.exactRule = exactRule;
    this.showLastBet = showLastBet;
    this.firstPlayerSetsRotation = firstPlayerSetsRotation;
    this.openCloseRound = openCloseRound;
  }
  setEasyRules(): void {
    this.setRules(
      true,
      true,
      true,
      true,
      false,
      false
    );
  }

  setClassicRules(): void {
    this.setRules(
      false,
      false,
      true,
      true,
      true,
      true,
    )
  }

  setPerudoRules() {
    this.setRules(
      false,
      false,
      false,
      true,
      false,
      false
    );
  }

  hydrateSettings(
    gameMode: 'solo' | 'multi' | 'multiBot',
    nbBots: number,
    nbPlayer: number,
    players: UserInput[],
    showNbTotalDice: boolean,
    showNbDiceByPlayer: boolean,
    showLastBet: boolean,
    exactRule: boolean,
    firstPlayerSetsRotation: boolean,
    openCloseRound: boolean,
    nbFacePerDice: number = 6,
    nbDicePerPlayer: number = 5,

  ): void {
    this.gameMode = gameMode;
    this.nbPlayer = nbPlayer;
    this.players = players;
    this.nbBots = nbBots;
    this.nbFacePerDice = nbFacePerDice;
    this.nbDicePerPlayer = nbDicePerPlayer;
    this.setRules(
      showNbTotalDice,
      showNbDiceByPlayer,
      exactRule,
      showLastBet,
      firstPlayerSetsRotation,
      openCloseRound
    );
  }

  getAllSettings(): Object {
    return {
      gameMode: this.gameMode,
      nbBots: this.nbBots,
      nbPlayer: this.nbPlayer,
      players: this.players,
      showNbTotalDice: this.showNbTotalDice,
      showNbDiceByPlayer: this.showNbDiceByPlayer,
      showLastBet: this.showLastBet,
      exactRule: this.exactRule,
      firstPlayerSetsRotation: this.firstPlayerSetsRotation,
      openCloseRound: this.openCloseRound,
      nbFacePerDice: this.nbFacePerDice,
      nbDicePerPlayer: this.nbDicePerPlayer,
    };
  }

  reset() {
    this.nbPlayer = 0;
    this.nbBots = 0;
    this.players = [];
  }
}
