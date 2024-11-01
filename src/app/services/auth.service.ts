import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Player} from "../entities/player.entity";
import {PlayersService} from "./players.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showModalSubject: BehaviorSubject<boolean>
  showModal$: Observable<boolean>
  errors!: String[];

  constructor(
    private playersService: PlayersService,
  ) {
    this.showModalSubject = new BehaviorSubject<boolean>(false);
    this.showModal$ = this.showModalSubject.asObservable();
    this.errors = [];
  }
  showModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.showModalSubject.next(false);
    this.clearErrors()
  }

  clearErrors(): void {
    this.errors = [];
  }

  showDice(password: String): void {
    if (!this.showModalSubject.value)
      return;

    this.clearErrors();
    const player: Player = this.playersService.getActivePlayer();

    if (this.checkAuthorization(password,player)) {
      this.revealDice(player);
      this.closeModal();
      return;
    }
    this.errors.push("Invalid password");
  }

  checkAuthorization(password: String, player: Player): boolean{
    return password === player.password;
  }
  revealDice(player: Player): void {
    player.toggleDiceVisibility();
  }
}
