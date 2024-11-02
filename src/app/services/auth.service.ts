import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Player} from "../entities/player.entity";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showModalSubject: BehaviorSubject<boolean>
  showModal$: Observable<boolean>
  errorsSubject!: BehaviorSubject<string[]>
  errors$!: Observable<string[]>;

  constructor() {
    this.showModalSubject = new BehaviorSubject<boolean>(false);
    this.showModal$ = this.showModalSubject.asObservable();
    this.errorsSubject = new BehaviorSubject<string[]>([]);
    this.errors$ = this.errorsSubject.asObservable();
  }
  showModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.showModalSubject.next(false);
    this.clearErrors()
  }

  clearErrors(): void {
    this.errorsSubject.next([]);
  }
  isModalOpen(): boolean {
    return this.showModalSubject.value;
  }

  isPlayerAuthorized(password: String, player: Player): boolean {
    this.clearErrors();

    if (this.checkAuthorization(password,player)) {
      this.closeModal();
      return true;
    }

    this.errorsSubject.next([...this.errorsSubject.value, "mot de passe incorrect"]);
    return false;
  }

  checkAuthorization(password: String, player: Player): boolean{
    return password === player.password;
  }

}
