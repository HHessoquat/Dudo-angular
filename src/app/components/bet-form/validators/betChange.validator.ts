import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Bet } from '../../../models/bet.model';
import { BehaviorSubject } from 'rxjs';

export function betChange(
  diceAmount: string,
  faceValue: string,
  currentBet: BehaviorSubject<Bet>
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(diceAmount) || !ctrl.get(faceValue)) {
      return {
        betChange: 'invalid control names',
      };
    }

    const diceAmountValue = ctrl.get(diceAmount)!.value;
    const faceValueValue = ctrl.get(faceValue)!.value;

    if (
      diceAmountValue !== currentBet.value.diceAmount ||
      faceValueValue !== currentBet.value.faceValue
    ) {
      return null;
    }
    return {
      betChange: ctrl.value,
    };
  };
}
