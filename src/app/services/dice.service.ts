import { Injectable } from '@angular/core';
import { Dice } from '../models/dice.model';
import { GameSetting } from './gameSetting.service';
import { Player } from '../entities/player.entity';
import { color } from '../features/dice';

@Injectable({
  providedIn: 'root',
})
export class DiceService {
  constructor(private settings: GameSetting) {}

  rollDice(players: Player[]): Dice[][] {
    return players.map((player) => {
      const playersDice: Dice[] = [];

      for (let i = 0; i < player.nbDiceLeft; i++) {
        playersDice.push({
          playerId: i,
          value: Math.ceil(Math.random() * 6),
          color: color[player.id],
        });
      }
      return playersDice;
    });
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
  getValueToCheck(diceResult: any) {
    const ajustedValues: any = {};
    for (const diceFace in diceResult) {
      diceFace === '1'
        ? (ajustedValues[diceFace] = diceResult[diceFace])
        : (ajustedValues[diceFace] = diceResult[diceFace] + diceResult['1']);
    }
    return ajustedValues;
  }
}
