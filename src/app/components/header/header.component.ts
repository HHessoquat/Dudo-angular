import {Component, OnInit} from '@angular/core';

import {AsyncPipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {languages} from "../../features/languages";
import {Language} from "../../models/language.model";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentLanguage!: string;
  LANGS: Language[] = languages;
  langControl!: FormControl;
  subscriptions!: Subscription[];

  constructor(private translate: TranslateService) {
  }
  ngOnInit() {
    this.currentLanguage = this.translate.currentLang;
    console.log(this.currentLanguage);

    this.langControl = new FormControl(this.currentLanguage || this.translate.getDefaultLang())
    this.subscriptions = [];
    this.subscriptions.push(this.langControl.valueChanges.subscribe(lang => {
      if (lang) {
        console.log(lang);
        this.currentLanguage = lang;
        this.changeLang(lang)
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  changeLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
