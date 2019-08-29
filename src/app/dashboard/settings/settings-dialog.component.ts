import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface Settings {
  influxdbServer: string;
  influxdbDatabase: string;
  refreshRate: number;
}

@Component({
  selector: 'hui-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Settings) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
