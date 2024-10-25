import { Dice } from './dice.model';

export interface DiceSet {
  playerId: number;
  dice: Dice[];
}
