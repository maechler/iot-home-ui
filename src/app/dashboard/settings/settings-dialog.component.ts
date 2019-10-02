import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface Settings {
  influxdbServer: string;
  influxdbDatabase: string;
  influxdbUsername: string;
  influxdbPassword: string;
  refreshRate: RefreshRate;
}

export enum RefreshRate {
  One = 1,
  Five = 5,
  Ten = 10,
  Thirty = 30,
  Sixty = 60,
}

@Component({
  selector: 'hui-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  refreshRates = Object.values(RefreshRate).filter((value) => !isNaN(value));

  constructor(
    public _dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Settings,
  ) {}

  onCloseClick(): void {
    this._dialogRef.close();
  }

  onUpdateClick(data: Settings): void {
    this._dialogRef.close(data);
  }
}
