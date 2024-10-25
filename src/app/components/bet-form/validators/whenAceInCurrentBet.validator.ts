import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Bet } from '../../../models/bet.model';

export function whenAceInCurrentBet(
  diceAmount: string,
  faceValue: string,
  currrentBet: Bet
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(diceAmount) || !ctrl.get(faceValue)) {
      return { whenAceInCurrentBet: 'wrong control name' };
    }
    const formDiceAmount: number = ctrl.get(diceAmount)!.value;
    const formFaceValue: number = ctrl.get(faceValue)!.value;
    const betDiceAmount: number = currrentBet.diceAmount;
    const betFaceValue: number = currrentBet.faceValue;

    if (
      betFaceValue === 1 &&
      formFaceValue !== 1 &&
      formDiceAmount < betDiceAmount * 2 + 1
    ) {
      return { whenAceInCurrentBet: ctrl.value };
    }
    return null;
  };
}
