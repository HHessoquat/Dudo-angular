import { BehaviorSubject, Observable } from 'rxjs';
import { Bet } from '../models/bet.model';
import { PlayerPosition } from '../features/players/position-types.type';
import { color } from '../features/dice';

export class Player {
  id!: number;
  name!: string;
  password!: string;
  diceColor!: string;
  nbDiceLeft!: number;
  areDiceVisible!: boolean;
  isPlaying!: boolean;
  lastBetSubject!: BehaviorSubject<Bet>;
  lastBet$!: Observable<Bet>;
  position!: string;


  constructor(
    id: number,
    name: string,
    password: string,
    position: PlayerPosition,
    nbDiceLeft = 5,
    diceAmount = 0,
    faceValue = 0,
    isPlaying = true
  ) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.nbDiceLeft = nbDiceLeft;
    this.diceColor= color[id];
    this.areDiceVisible = false;
    this.isPlaying = isPlaying;
    this.lastBetSubject = new BehaviorSubject<Bet>({
      diceAmount,
      faceValue,
    });
    this.lastBet$ = this.lastBetSubject.asObservable();
    this.position = position;
  }

  toggleDiceVisibility(): void {
    this.areDiceVisible = !this.areDiceVisible;
  }
  showDice() {
    this.areDiceVisible = true;
  }
  hideDice(): void {
    this.areDiceVisible = false;
  }

  loseDice(): void {
    this.nbDiceLeft--;
    this.nbDiceLeft <= 0 && (this.isPlaying = false);
  }
  winDice(): void {
    this.nbDiceLeft < 5 && this.nbDiceLeft++;
  }
  resetBet(): void {
    this.lastBetSubject.next({ diceAmount: 0, faceValue: 0 });
  }
}
