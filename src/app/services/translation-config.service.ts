import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TranslationConfigService {
  currentLanguageSubject!: BehaviorSubject<string>;
  currentLanguage$!: Observable<string>;
  defaultLanguage!: string;
  acceptedLanguages! : string[];
  constructor() {
    this.acceptedLanguages = ['en', 'fr', 'de', 'cs'];
    this.defaultLanguage = 'fr';
    this.currentLanguageSubject = new BehaviorSubject<string>('fr');
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }
}
