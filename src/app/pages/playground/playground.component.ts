import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { SaveGame } from '../../services/save-game.service';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../components/player/player.component';
import { BetFormComponent } from '../../components/bet-form/bet-form.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, PlayerComponent, BetFormComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent implements OnInit {
  constructor(public gameManager: GameService, private gameSaver: SaveGame) {}
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
