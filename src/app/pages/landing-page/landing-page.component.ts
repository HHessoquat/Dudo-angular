import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
  }

  onNavigateToGameSettings(gameMode: 'solo' | 'multi' | 'multiBot') {
    this.router.navigateByUrl(`/gameSetting/${gameMode}`);
  }
}
