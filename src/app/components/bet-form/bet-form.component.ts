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
    private betManager: BetService,
    private round: RoundService
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
  }
  initControls(): void {
    this.diceAmount = this.formBuilder.control(1, Validators.required);
    this.faceValue = this.formBuilder.control(2, Validators.required);
  }
  initForm(): void {
    this.betForm = this.formBuilder.group({
      diceAmount: this.diceAmount,
      faceValue: this.faceValue,
    });
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
    newValue < this.round.currentBetSubject.value.diceAmount &&
      this.faceValue.setValue(1);
  }
  onIncrementFace(): void {
    const currentFace = this.faceValue.value;
    this.faceValue.setValue(this.betManager.increaseFaceValue(currentFace));
    currentFace === 1 &&
      this.diceAmount.value <= this.round.currentBetSubject.value.diceAmount &&
      this.diceAmount.setValue(this.round.currentBetSubject.value.diceAmount);
  }
  onDecrementFace(): void {
    this.faceValue.setValue(
      this.betManager.decreaseFaceValue(this.faceValue.value)
    );
  }
  onbet(): void {
    this.game.setCurrentBet(this.diceAmount.value, this.faceValue.value);
    this.round.nextPlayer();
  }
  onDudo(): void {
    this.game.resolveRound('dudo');
  }
}
