import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {EditItemComponent} from './edit-item.component';
import {SensorService} from '../../shared/sensor/sensor.service';
import {DashboardItemsService} from '../dashboard-items.service';

@Component({
  template: '',
})
export class EditItemEntryComponent {
  itemId = '';

  constructor(public addItemDialog: MatDialog, private router: Router, private route: ActivatedRoute, private sensorService: SensorService, private dashboardItemsService: DashboardItemsService) {
    this.route.paramMap.subscribe(paramMap => {
      this.itemId = paramMap.get('id');
    });

    this.openEditItemDialog();
  }

  openEditItemDialog(): void {
    const item = this.dashboardItemsService.getItemById(this.itemId);

    const dialogRef = this.addItemDialog.open(EditItemComponent, {
      width: '500px',
      data: {
        item: item,
        color: 'yellow',
        size: item ? item.size$.getValue() : '1x1',
        duration: item ? item.duration$.getValue() : '7d',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../../'], { relativeTo: this.route });

      if (result) {
        const item = this.dashboardItemsService.getItemById(this.itemId);

        item.setDuration(result.duration);
        item.setSize(result.size);

        this.dashboardItemsService.storeItems();
      }
    });
  }
}
