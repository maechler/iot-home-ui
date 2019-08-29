import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {SettingsDialogComponent} from './settings-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from './settings.service';

@Component({
  template: '',
})
export class SettingsDialogEntryComponent {
  constructor(public settingsDialog: MatDialog, private router: Router, private route: ActivatedRoute, private settingsService: SettingsService) {
    this.openSettingsDialog();
  }

  openSettingsDialog(): void {
    const dialogRef = this.settingsDialog.open(SettingsDialogComponent, {
      width: '500px',
      data: this.settingsService.getSettings()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });

      if (result) {
        this.settingsService.setSettings(result);
      }
    });
  }
}
