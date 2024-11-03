import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";;
import {AuthService} from "../../services/auth.service";
import {DiceService} from "../../services/dice.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TranslateModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})

export class AuthModalComponent implements OnInit {
  //TODO show errors
  userPassword!: FormControl
  errorMessages$!: Observable<string[]>;
  constructor(
    private authManager: AuthService,
    private diceManager: DiceService,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit() {
    this.userPassword = this.formBuilder.control('', [Validators.required]);
    this.errorMessages$ = this.authManager.errors$;
  }


  showDice() {
    this.diceManager.showCurrentPlayerDice(this.userPassword.value);
  }

  closeModal() {
    this.authManager.closeModal();
  }
}
