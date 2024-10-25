import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Bet } from '../../../models/bet.model';

export function validInputValue(
  diceAmount: string,
  faceValue: string
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(diceAmount) || !ctrl.get(faceValue)) {
      return {
        validInputValue: 'invalid control name',
      };
    }
    const formDiceAmount = ctrl.get(diceAmount)!.value;
    const formFaceValue = ctrl.get(faceValue)!.value;
    if (isNaN(formDiceAmount) || isNaN(formFaceValue)) {
      return { validInputValue: 'entry is not a number' };
    }
    if (formDiceAmount <= 0 || formFaceValue <= 0) {
      return { validInputValue: '' };
    }

    return null;
  };
}
