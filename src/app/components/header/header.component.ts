import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {TranslationConfigService} from "../../services/translation-config.service";
import {Subscription} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private subscription!: Subscription[];
  constructor(private translate: TranslateService, public translationConfig: TranslationConfigService) {
  }
  ngOnInit() {
    this.subscription = [];
    this.translate.setDefaultLang(this.translationConfig.defaultLanguage);
    this.subscription.push(this.translationConfig.currentLanguage$.subscribe(currentLanguage => {
      this.translate.setDefaultLang(currentLanguage);
    }));
  }
  ngOnDestroy() {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    })
  }
}
