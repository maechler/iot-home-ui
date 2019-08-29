import { Injectable } from '@angular/core';
import {Settings} from './settings-dialog.component';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly _settings = new BehaviorSubject<Settings>({
    influxdbServer: '',
    influxdbDatabase: '',
    refreshRate: 10,
  });
  private settingsStorageKey = 'hui.dashboard.settings';

  readonly settings$ = this._settings.asObservable();

  constructor() {
    const storageSettings = localStorage.getItem(this.settingsStorageKey);

    if (storageSettings) {
      this._settings.next(JSON.parse(storageSettings));
    }
  }

  public getSettings() {
    return this._settings.getValue();
  }

  public setSettings(settings: object) {
    this._settings.next({
      ...this._settings.getValue(),
      ...settings,
    });

    localStorage.setItem(this.settingsStorageKey, JSON.stringify(this.getSettings()));
  }
}
