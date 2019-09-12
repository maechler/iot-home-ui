import { Component } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AddItemComponent} from './add-item.component';
import {SensorService} from '../../shared/sensor/sensor.service';
import {DashboardItemsService} from '../dashboard-items.service';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  template: '',
})
export class AddItemEntryComponent {
  selectedUnit$ = new BehaviorSubject('');
  sensors$ = new Subject<Array<object>>();

  constructor(public addItemDialog: MatDialog, private router: Router, private route: ActivatedRoute, private sensorService: SensorService, private dashboardItemsService: DashboardItemsService) {
    this.openAddItemDialog();
  }

  unitChangeHandler(input) {
    this.selectedUnit$.next(input);
  }

  openAddItemDialog(): void {
    const dialogRef = this.addItemDialog.open(AddItemComponent, {
      width: '500px',
      data: {
        unitChangeHandler: this.unitChangeHandler,
        units: this.sensorService.fetchUnits(),
        sensors$: this.sensors$,
        selectedSensor: '',
        selectedUnit$: this.selectedUnit$,
        type: 'value',
        size: '1x1',
      }
    });

    this.selectedUnit$.subscribe((selectedUnit) => {
      this.sensorService.fetchSensorsByUnit(selectedUnit).subscribe((res) => {
        this.sensors$.next(res);
      });
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });

      if (result) {
        this.dashboardItemsService.addItem(this.dashboardItemsService.createItem(result.selectedUnit$.getValue(), result.selectedSensor, result.size, result.type));
      }
    });
  }
}
