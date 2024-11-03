import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../entities/player.entity";
import {Subscription} from "rxjs";
import {PlayersService} from "../../services/players.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-player-lost',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './player-lost.component.html',
  styleUrl: './player-lost.component.scss'
})
export class PlayerLostComponent implements OnInit{
   @Input() playerId!: number;
   player!: Player;


  constructor(private playerManager: PlayersService) {
  }
  ngOnInit() {
    this.player = this.playerManager.getAllPlayers().find(player => player.id === this.playerId)!;
  }

}
