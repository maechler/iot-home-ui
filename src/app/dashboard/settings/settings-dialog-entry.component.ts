import { Component } from '@angular/core';
import {MatDialog} from '@angular/material';
import {SettingsDialogComponent} from './settings-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from './settings.service';

@Component({
  template: '',
})
export class SettingsDialogEntryComponent {
  constructor(
    public settingsDialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute,
    private _settingsService: SettingsService
  ) {
    this.openSettingsDialog();
  }

  openSettingsDialog(): void {
    const dialogRef = this.settingsDialog.open(SettingsDialogComponent, {
      width: '500px',
      data: {...this._settingsService.getSettings()},
    });

    dialogRef.afterClosed().subscribe(data => {
      this._router.navigate(['../'], { relativeTo: this._route });

      if (data) {
        this._settingsService.setSettings(data);
      }
    });
  }
}
