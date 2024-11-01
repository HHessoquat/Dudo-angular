import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";;
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})

export class AuthModalComponent implements OnInit {
  //TODO show errors
  userPassword!: FormControl
  constructor(
    private authManager: AuthService,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit() {
    this.userPassword = this.formBuilder.control('', [Validators.required]);
  }


  showDice() {
    this.authManager.showDice(this.userPassword.value);
  }

  closeModal() {
    this.authManager.closeModal();
  }
}
