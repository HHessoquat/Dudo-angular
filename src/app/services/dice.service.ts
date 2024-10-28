import { Injectable } from '@angular/core';
import { Dice } from '../models/dice.model';
import { GameSetting } from './gameSetting.service';
import { Player } from '../entities/player.entity';
import { color } from '../features/dice';
import { DiceSet } from '../models/diceSet.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiceService {
  diceSubject!: BehaviorSubject<DiceSet[]>;
  dices$!: Observable<DiceSet[]>;
  nbDice!: number;
  constructor(private settings: GameSetting) {
    this.diceSubject = new BehaviorSubject([
      { playerId: 0, dice: [{ value: 1, color: color[0] }] },
    ]);
    this.dices$ = this.diceSubject.asObservable();
  }

  getAllDice(): DiceSet[] {
    return this.diceSubject.value;
  }

  getDiceForPlayer(playerId: Number): DiceSet | null {
    return (
      this.diceSubject.value.find(
        (playersdice) => playersdice.playerId === playerId
      ) || null
    );
  }

  rollDice(players: Player[]): void {
    this.diceSubject.next(
      players.map((player): DiceSet => {
        const playersDice: Dice[] = [];

        for (let i = 0; i < player.nbDiceLeft; i++) {
          playersDice.push({
            value: Math.ceil(Math.random() * this.settings.nbFacePerDice),
            color: color[player.id],
          });
        }
        return { playerId: player.id, dice: playersDice };
      })
    );
  }

  reduceDiceValue(dice: Dice[][]) {
    const allDice: Dice[] = [];
    dice.forEach((diceSet) => diceSet.forEach((dice) => allDice.push(dice)));

    const result: any = {};

    for (let i = 1; i <= this.settings.nbFacePerDice; i++) {
      result[`${i}`] = allDice.reduce(
        (acc, dice) => (dice.value === i ? acc + 1 : acc),
        0
      );
    }

    return result;
  }
  getValueToCheck(allDice: Dice[][]) {
    const diceResult = this.reduceDiceValue(allDice);
    const ajustedValues: any = {};
    for (const diceFace in diceResult) {
      diceFace === '1'
        ? (ajustedValues[diceFace] = diceResult[diceFace])
        : (ajustedValues[diceFace] = diceResult[diceFace] + diceResult['1']);
    }
    return ajustedValues;
  }

  setNbDice(players: Player[]): void {
    this.nbDice = players.reduce((acc, player: Player) => {
      return acc + player.nbDiceLeft;
    }, 0);
  }

  hydrateDice(dices: DiceSet[], nbDice: number): void {
    this.diceSubject = new BehaviorSubject(dices);
    this.dices$ = this.diceSubject.asObservable();
    this.nbDice = nbDice;
  }

  getDataToSave() {
    return {
      dices: this.diceSubject.value,
      nbDice: this.nbDice,
    };
  }
}
