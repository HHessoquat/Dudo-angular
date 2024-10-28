import { Injectable } from '@angular/core';
import { GameSetting } from './gameSetting.service';
import { GameService } from './game.service';
import { RoundService } from './round.service';
import { BetService } from './bet.service';
import { PlayersService } from './players.service';
import { DiceService } from './dice.service';

@Injectable({
  providedIn: 'root',
})
export class SaveGame {
  constructor(
    private settings: GameSetting,
    private game: GameService,
    private players: PlayersService,
    private bet: BetService,
    private dice: DiceService,
    private round: RoundService
  ) {}

  savesettings(): void {
    sessionStorage.setItem(
      'settings',
      JSON.stringify(this.settings.getAllSettings())
    );
  }

  saveGame(): void {
    sessionStorage.setItem(
      'gameData',
      JSON.stringify(this.game.getDataToSave())
    );
    sessionStorage.setItem(
      'playersData',
      JSON.stringify(this.players.getDataToSave())
    );
    sessionStorage.setItem('betData', JSON.stringify(this.bet.getDataToSave()));
    sessionStorage.setItem('diceData', JSON.stringify(this.dice.getDataToSave())
    );
    sessionStorage.setItem('roundData', JSON.stringify(this.round.getDataToSave()));
  }

  retrieveSessionData(): boolean {
    const isSessionOn = sessionStorage.getItem('gameData');
    if (!isSessionOn) {
      return false;
    }
    console.log('gameRetrieved');
    const settings = JSON.parse(sessionStorage.getItem('settings')!);
    const game = JSON.parse(isSessionOn);
    const players = JSON.parse(sessionStorage.getItem('playersData')!);
    const bet = JSON.parse(sessionStorage.getItem('betData')!);
    const dice = JSON.parse(sessionStorage.getItem('diceData')!);
    const round = JSON.parse(sessionStorage.getItem("roundData")!);

    this.settings.hydrateSettings(
      settings.gameMode,
      settings.showNbDice,
      settings.nbPlayer,
      settings.players,
      settings.nbBots
    );
    this.round.hydrateRound(round.roundResult);
    this.players.hydratePlayers(
      players.playersData,
      players.lastBets,
      players.activePlayer
    );
    this.bet.hydrateBet(bet);
    this.dice.hydrateDice(dice.dices, dice.nbDice);
    this.game.hydrateGame(game.endRound);
    return true;
  }

}
