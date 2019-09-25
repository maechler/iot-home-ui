import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface Settings {
  influxdbServer: string;
  influxdbDatabase: string;
  refreshRate: number;
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

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Settings) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
