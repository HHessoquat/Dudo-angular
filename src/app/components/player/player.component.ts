import { Component, Input, OnInit } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';
import { CommonModule } from '@angular/common';
import { Dice } from '../../models/dice.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../entities/player.entity';
import { Subscription } from 'rxjs';
import { PlayersService } from '../../services/players.service';
import { DiceService } from '../../services/dice.service';
import { DiceSet } from '../../models/diceSet.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, DiceComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  @Input() playerId!: number;
  @Input() isCurrentPlayer!: boolean;
  player!: Player;
  dice?: Dice[];
  subscription: Subscription[] = [];

  constructor(
    public game: GameService,
    public players: PlayersService,
    public diceManager: DiceService
  ) {}
  ngOnInit(): void {
    this.subscription.push(
      this.players.activePlayers$.subscribe(players => {
        this.player = players.find(player => player.id === this.playerId)!;
        }
      )
    );

    this.subscription.push(
      this.diceManager.dices$.subscribe((dice) => {
        this.dice = dice.find(
          (diceSet: DiceSet) => diceSet.playerId === this.player.id
        )?.dice;
      })
    );

  }
  ngOndestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
