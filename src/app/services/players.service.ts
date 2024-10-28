import { Injectable } from '@angular/core';
import { Player } from '../entities/player.entity';
import { getPosition } from '../features/players/players';
import { GameSetting } from './gameSetting.service';
import { PlayerPosition } from '../features/players/position-types.type';
import { RoundResult } from '../models/round-result.model';
import { Bet } from '../models/bet.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  allPlayers!: Player[];
  activePlayersSubject!: BehaviorSubject<Player[]>;
  activePlayers$!: Observable<Player[]>;
  currentPlayerSubject!: BehaviorSubject<number>;
  currentPlayerIndex$!: Observable<number>;
  nbActivePlayers!: number;

  constructor(private settings: GameSetting) {
    this.currentPlayerSubject = new BehaviorSubject<number>(0);
    this.activePlayersSubject = new BehaviorSubject<Player[]>([]);
    this.activePlayers$ = this.activePlayersSubject.asObservable();
    this.currentPlayerIndex$ = this.currentPlayerSubject.asObservable();
  }

  setPlayers(): void {
    const POSITION: Array<PlayerPosition> = getPosition(this.settings.nbPlayer);

    this.allPlayers = this.settings.players.map((player, index) => {
      return new Player(
        index,
        player.name,
        player.password,
        POSITION[index],
        this.settings.nbDicePerPlayer
      );
    });
  }

  getAllPlayers(): Player[] {
    return this.allPlayers;
  }

  setActivePlayers(): void {
    this.activePlayersSubject.next(this.allPlayers.filter((player) => player.isPlaying));
  }

  getActivePlayers(): Player[] {
    return this.activePlayersSubject.value;
  }
  getCurrentPlayerIndex(): number {
    return this.currentPlayerSubject.value;
  }

  setActivePlayerIndex(index: number): void {
    this.currentPlayerSubject.next(index);
  }

  setNbActivePlayers():void {
    this.nbActivePlayers = this.getActivePlayers().length
  }

  nextPlayer(): void {
    const nextIndex = (this.getCurrentPlayerIndex() + 1) % this.nbActivePlayers;
    this.setActivePlayerIndex(nextIndex);
  }

  initRound(): void {
    this.allPlayers.forEach((player) => player.resetBet());
    this.setNbActivePlayers();
  }

  endRoundConsequence(roundResult: RoundResult): void {
    if (roundResult.roundLoserId !== -1) {
      this.getActivePlayers().find(player => player.id === roundResult.roundLoserId)!.loseDice();
    }
    if (roundResult.roundWinnerId !== -1) {
      this.getActivePlayers().find(player => player.id === roundResult.roundWinnerId)!.winDice();
    }
    this.setActivePlayers();
  }

  hydratePlayers(players: Player[], lastBets: any, activePlayerIndex: number) {
    this.allPlayers = players.map((player) => {
      const playerBet = lastBets.find(
        (bet: { id: number; bet: Bet }) => bet.id === player.id
      );
      return new Player(
        player.id,
        player.name,
        player.password,
        player.position as PlayerPosition,
        player.nbDiceLeft,
        playerBet.bet.diceAmount,
        playerBet.bet.faceValue,
        player.isPlaying
      );
    });
    this.setActivePlayers();
    this.setNbActivePlayers();
    this.currentPlayerSubject.next(activePlayerIndex);
  }

  getDataToSave() {
    const lastBets = this.allPlayers.map((player) => {
      return { id: player.id, bet: player.lastBetSubject.value };
    });

    const playersData = this.allPlayers.map((player) => {
      return {
        id: player.id,
        name: player.name,
        password: player.password,
        position: player.position,
        nbDiceLeft: player.nbDiceLeft,
        isPlaying: player.isPlaying,
      };
    });

    return {
      playersData,
      lastBets,
      activePlayer: this.currentPlayerSubject.value,
    };
  }

}
