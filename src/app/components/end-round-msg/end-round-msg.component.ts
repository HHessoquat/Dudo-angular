import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { RoundService } from '../../services/round.service';
import { CommonModule } from '@angular/common';
import { SaveGame } from '../../services/save-game.service';
import { PlayersService } from '../../services/players.service';
import { DiceService } from '../../services/dice.service';

@Component({
  selector: 'app-end-round-msg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './end-round-msg.component.html',
  styleUrl: './end-round-msg.component.scss',
})
export class EndRoundMsgComponent implements OnInit {
  winnerName?: string;
  winnerGetDice?: boolean;
  loserName?: string | null;
  diceResult!: { diceAmount: number; faceValue: number };
  constructor(
    private game: GameService,
    private round: RoundService,
    private gameSaver: SaveGame,
    private players: PlayersService,
    private dice: DiceService
  ) {}
  ngOnInit(): void {
    this.winnerName =
      this.round.roundResult.roundWinner !== -1
        ? this.players.getActivePlayers()[this.round.roundResult.roundWinner]
            .name
        : undefined;

    this.winnerGetDice = this.winnerName
      ? this.dice.diceSubject.value[this.players.currentPlayerSubject.value].dice
          .length < 5
      : undefined;

    this.loserName =
      this.round.roundResult.roundLoser !== -1
        ? this.players.getActivePlayers()[this.round.roundResult.roundLoser]
            .name
        : undefined;

    this.diceResult = {
      diceAmount: this.round.roundResult.diceAmount,
      faceValue: this.round.roundResult.faceValue,
    };
  }

  onNext(): void {
    this.game.nextRound();
  }

  ngOnDestroy() {
    this.gameSaver.saveGame();
  }
}
