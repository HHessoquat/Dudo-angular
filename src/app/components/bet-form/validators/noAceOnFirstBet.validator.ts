import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Bet } from '../../../models/bet.model';

export function noAceOnFirstBet(
  faceValue: string,
  currentBet: BehaviorSubject<Bet>
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(faceValue)) {
      return { noAceOnFirstBet: 'invalid control name' };
    }
    const formFaceValue = ctrl.get(faceValue)!.value;
    if (currentBet.value.diceAmount === 0 && formFaceValue === 1) {
      return {
        noAceOnFirstBet: ctrl.value,
      };
    }
    return null;
  };
}
