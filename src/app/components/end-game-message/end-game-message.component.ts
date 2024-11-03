import {Component, OnInit} from '@angular/core';
import {PlayersService} from "../../services/players.service";
import {Router} from "@angular/router";
import {SaveGame} from "../../services/save-game.service";
import {GameService} from "../../services/game.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-end-game-message',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './end-game-message.component.html',
  styleUrl: './end-game-message.component.scss'
})
export class EndGameMessageComponent implements OnInit {
  winner!: { winner: string };

  constructor(
    private playerManager: PlayersService,
    private gameManager: GameService,
    private gameSaver: SaveGame,
    private router: Router
  ) {}
  ngOnInit() {
    this.winner = {winner: this.playerManager.getActivePlayers()[0].name}
  }

  onNewGame(): void {
    this.gameSaver.resetGame();
    this.router.navigateByUrl('');
  }

  onNewGameWithSameSettings(): void {
    this.gameSaver.restartGame();
    this.gameManager.initGame();
  }
}
