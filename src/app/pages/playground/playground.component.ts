import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { SaveGame } from '../../services/save-game.service';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { BetFormComponent } from '../../components/bet-form/bet-form.component';
import { EndRoundMsgComponent } from '../../components/end-round-msg/end-round-msg.component';
import { PlayerLostComponent } from '../../components/player-lost/player-lost.component';
import { PlayersService } from '../../services/players.service';
import { EndGameMessageComponent } from '../../components/end-game-message/end-game-message.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    BetFormComponent,
    EndRoundMsgComponent,
    PlayerLostComponent,
    EndGameMessageComponent,
  ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent implements OnInit {
  constructor(
    public gameManager: GameService,
    public players: PlayersService,
    private gameSaver: SaveGame
  ) {}
  ngOnInit(): void {
    const isSessionOn = this.gameSaver.retrieveSessionData();
    if (!isSessionOn) {
      this.gameManager.initGame();
      this.gameManager.initRound();
      this.gameSaver.savesettings();
      this.gameSaver.saveGame();
      return;
    }
    this.gameSaver.saveGame();
  }
}
