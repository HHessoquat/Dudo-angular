import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameSetting } from '../../../services/gameSetting.service';
import { Observable, startWith, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multi-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './multi-settings.component.html',
  styleUrl: './multi-settings.component.scss',
})
export class MultiSettingsComponent implements OnInit {
  nbPlayers!: FormControl;
  players!: FormArray;
  @Input() playersForm!: FormGroup;
  nbInput$?: Observable<string>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
    this.initFormObservables();
    this.addPlayersNameInput();
  }

  private initControls(): void {
    this.nbPlayers = this.formBuilder.control('2', Validators.required);
    this.players = this.formBuilder.array([
      this.formBuilder.group({
        name: this.formBuilder.control('joueur 1', Validators.required),
        password: this.formBuilder.control('', Validators.required),
      }),
    ]);
  }
  private initForm(): void {
    this.playersForm.addControl('nbPlayers', this.nbPlayers);
    this.playersForm.addControl('players', this.players);
    // ({
    //   nbPlayers: this.nbPlayers,
    //   players: this.players,
    // });
  }
  private initFormObservables() {
    this.nbInput$ = this.playersForm.get('nbPlayers')?.valueChanges.pipe(
      startWith('2'),
      tap(() => {
        this.addPlayersNameInput();
      })
    );
  }

  addPlayersNameInput(): void {
    this.players.clear();
    for (let i = 0; i < this.playersForm.get('nbPlayers')?.value; i++) {
      this.players.push(
        this.formBuilder.group({
          name: this.formBuilder.control(
            `joueur ${i + 1}`,
            Validators.required
          ),
          password: this.formBuilder.control('', Validators.required),
        })
      );
    }
  }
  getPlayerByindex(index: number): FormGroup {
    return this.players.at(index) as FormGroup;
  }
  getPlayersNameControlByIndex(index: number): FormControl {
    const playerForm = this.players.at(index) as FormGroup;
    return playerForm.get('name') as FormControl;
  }
  getPasswordbyIndex(index: number): FormControl {
    const playerForm = this.players.at(index) as FormGroup;
    return playerForm.get('password') as FormControl;
  }
}
