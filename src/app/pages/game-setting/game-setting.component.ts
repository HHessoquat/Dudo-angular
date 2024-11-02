import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingFormComponent } from '../../components/game-setting-management/setting-form/setting-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MultiSettingsComponent } from '../../components/game-setting-management/multi-settings/multi-settings.component';
import { SoloSettingsComponent } from '../../components/game-setting-management/solo-settings/solo-settings.component';
import { UserInput } from '../../models/user-input.model';
import { GameSetting } from '../../services/gameSetting.service';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-game-setting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingFormComponent,
    MultiSettingsComponent,
    SoloSettingsComponent,
    TranslateModule,
  ],
  templateUrl: './game-setting.component.html',
  styleUrl: './game-setting.component.scss',
})
export class GameSettingComponent implements OnInit {
  mainForm!: FormGroup;
  gameMode!: 'solo' | 'multi' | 'multiBot';
  generalSettings!: FormGroup;
  playerSetting!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private gameSettings: GameSetting,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    sessionStorage.clear();
    this.gameMode = this.route.snapshot.params['gameMode'];
    this.initFormGroups();
    this.initMainForm();
    this.cdr.detectChanges();
  }
  initFormGroups(): void {
    this.generalSettings = this.formBuilder.group({});
    this.playerSetting = this.formBuilder.group({});
  }
  initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      generalSetting: this.generalSettings,
      playersSettings: this.playerSetting,
    });
  }
  onSubmit() {
    this.gameSettings.hydrateSettings(
      this.gameMode,
      true,
      parseInt(this.playerSetting.get('nbPlayers')?.value),
      this.playerSetting.get('players')?.value as UserInput[]
    );
    this.router.navigateByUrl('/playground');
  }
}
