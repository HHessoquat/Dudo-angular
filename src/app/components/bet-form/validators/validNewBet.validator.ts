import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Bet } from '../../../models/bet.model';

export function validNewBet(
  diceAmount: string,
  faceValue: string,
  currentBet: BehaviorSubject<Bet>
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(diceAmount) || !ctrl.get(faceValue)) {
      return {
        validInputValue: 'invalid control name',
      };
    }
    const formDiceAmount = ctrl.get(diceAmount)!.value;
    const formFaceValue = ctrl.get(faceValue)!.value;
    const betDiceAmount = currentBet.value.diceAmount;
    const betFaceValue = currentBet.value.faceValue;

    if (formDiceAmount < betDiceAmount && formFaceValue !== 1) {
      return {
        validNewBet: ctrl.value,
      };
    }
    if (
      formFaceValue < betFaceValue &&
      formFaceValue !== 1 &&
      formDiceAmount <= betDiceAmount
    ) {
      return { validNewBet: ctrl.value };
    }
    if (
      formFaceValue === 1 &&
      betFaceValue !== 1 &&
      formDiceAmount < Math.ceil(betDiceAmount / 2)
    ) {
      return { validNewBet: ctrl.value };
    }
    if (
      formFaceValue === 1 &&
      betFaceValue === 1 &&
      formDiceAmount <= betDiceAmount
    ) {
      return { validNewBet: ctrl.value };
    }
    return null;
  };
}
