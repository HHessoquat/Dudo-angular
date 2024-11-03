import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {TranslateService} from "@ngx-translate/core";
import {languages} from "./features/languages";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  title = 'dudo';
  constructor(private translate: TranslateService) {
  }
  ngOnInit() {
    this.translate.addLangs(languages.map(lang => lang.code))
    this.translate.setDefaultLang('en');
    this.translate.use( localStorage.getItem('lang') || 'fr');
  }
}
