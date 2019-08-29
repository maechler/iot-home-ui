import { Component } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AddItemComponent} from './add-item.component';
import {SensorService} from '../../shared/sensor/sensor.service';
import {DashboardItemsService} from '../dashboard-items.service';
import {DashboardItem} from '../dashboard-item/dashboard-item';

@Component({
  template: '',
})
export class AddItemEntryComponent {
  constructor(public addItemDialog: MatDialog, private router: Router, private route: ActivatedRoute, private sensorService: SensorService, private dashboardItemsService: DashboardItemsService) {
    this.openAddItemDialog();
  }

  openAddItemDialog(): void {
    const dialogRef = this.addItemDialog.open(AddItemComponent, {
      width: '500px',
      data: {
        units: this.sensorService.fetchAllUnits(),
        selectedUnit: '',
        size: '1x1',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });

      if (result) {
        this.dashboardItemsService.addItem(new DashboardItem(result.selectedUnit, result.size));
      }
    });
  }
}
