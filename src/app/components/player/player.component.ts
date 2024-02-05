import { Component, Input, OnInit } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';
import { CommonModule } from '@angular/common';
import { Dice } from '../../models/dice.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../entities/player.entity';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, DiceComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  @Input() playerId!: number;
  player!: Player;
  dice!: Dice[];
  isActive!: boolean;

  constructor(private game: GameService, public round: RoundService) {}
  ngOnInit(): void {
    this.player = this.game.players[this.playerId];
    this.dice = this.game.dices[this.playerId];
  }
}
