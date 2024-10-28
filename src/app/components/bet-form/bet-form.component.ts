import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { BetService } from '../../services/bet.service';
import { RoundService } from '../../services/round.service';
import { SaveGame } from '../../services/save-game.service';
import { betChange } from './validators/betChange.validator';
import { noAceOnFirstBet } from './validators/noAceOnFirstBet.validator';
import { validInputValue } from './validators/validInputValue.validator';
import { validNewBet } from './validators/validNewBet.validator';
import { whenAceInCurrentBet } from './validators/whenAceInCurrentBet.validator';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-bet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bet-form.component.html',
  styleUrl: './bet-form.component.scss',
})
export class BetFormComponent implements OnInit {
  betForm!: FormGroup;
  diceAmount!: FormControl;
  faceValue!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private game: GameService,
    protected betManager: BetService,
    private players: PlayersService,
    private gameSaver: SaveGame
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
  }
  initControls(): void {
    const firstDiceAmount: number =
      this.betManager.getDiceAmount() === 0
        ? 1
        : this.betManager.getDiceAmount();
    const firstFaceValue: number =
      this.betManager.getFaceValue() === 0 ? 2 : this.betManager.getFaceValue();
    this.diceAmount = this.formBuilder.control(
      firstDiceAmount,
      Validators.required
    );
    this.faceValue = this.formBuilder.control(
      firstFaceValue,
      Validators.required
    );
  }
  initForm(): void {
    this.betForm = this.formBuilder.group(
      {
        diceAmount: this.diceAmount,
        faceValue: this.faceValue,
      },
      {
        validators: [
          betChange(
            'diceAmount',
            'faceValue',
            this.betManager.currentBetSubject
          ),
          noAceOnFirstBet('faceValue', this.betManager.currentBetSubject),
          validInputValue('diceAmount', 'faceValue'),
          validNewBet(
            'diceAmount',
            'faceValue',
            this.betManager.currentBetSubject
          ),
          whenAceInCurrentBet(
            'diceAmount',
            'faceValue',
            this.betManager.getBet()
          ),
        ],
      }
    );
  }
  onIncrementDice(): void {
    this.diceAmount.setValue(
      this.betManager.increaseNbDice(this.diceAmount.value)
    );
  }
  onDecrementDice(): void {
    const newValue = this.betManager.decreaseNBdice(
      this.diceAmount.value,
      this.faceValue.value
    );
    this.diceAmount.setValue(newValue);
    newValue < this.betManager.getDiceAmount() && this.faceValue.setValue(1);
  }
  onIncrementFace(): void {
    const currentFace = this.faceValue.value;
    const diceAmount = this.diceAmount.value;
    const newValue = this.betManager.increaseFaceValue(currentFace, diceAmount);
    this.faceValue.setValue(newValue.faceValue);
    this.diceAmount.setValue(newValue.diceAmount);
  }
  onDecrementFace(): void {
    this.faceValue.setValue(
      this.betManager.decreaseFaceValue(this.faceValue.value)
    );
  }
  onbet(): void {
    this.game.setCurrentBet(this.diceAmount.value, this.faceValue.value);
    this.players.nextPlayer();
    this.gameSaver.saveGame();
    this.betForm.updateValueAndValidity();
  }
  onEndRound(trigger: 'dudo' | 'exact'): void {
    this.game.resolveRound(trigger);
    this.gameSaver.saveGame();
  }
}
