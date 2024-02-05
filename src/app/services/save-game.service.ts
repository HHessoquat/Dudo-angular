import { Injectable } from '@angular/core';
import { GameSetting } from './gameSetting.service';
import { GameService } from './game.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoundService } from './round.service';

@Injectable({
  providedIn: 'root',
})
export class SaveGame {
  constructor(
    private settings: GameSetting,
    private game: GameService,
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
      'roundData',
      JSON.stringify(this.round.getDataToSave())
    );
  }
  retrieveSessionData(): boolean {
    const isSessionOn = sessionStorage.getItem('gameData');
    if (!isSessionOn) {
      return false;
    }
    console.log('gameRetrieved');
    const settings = JSON.parse(sessionStorage.getItem('settings')!);
    const game = JSON.parse(isSessionOn);
    const round = JSON.parse(sessionStorage.getItem('roundData')!);
    console.log(round);
    this.settings.hydrateSettings(
      settings.gameMode,
      settings.showNbDice,
      settings.nbPlayer,
      settings.players,
      settings.nbBots
    );
    this.game.hydrateGame(
      game.players,
      game.lastBets,
      game.dices,
      game.nbDice,
      game.endRound
    );
    this.round.hydrateRound(round.activePlayerSubject, round.currentBetSubject);
    return true;
  }
}
