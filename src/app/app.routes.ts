import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./pages/playground/playground.component').then(
        (m) => m.PlaygroundComponent
      ),
  },
  {
    path: 'gameSetting/:gameMode',
    loadComponent: () =>
      import('./pages/game-setting/game-setting.component').then(
        (m) => m.GameSettingComponent
      ),
  },
];
