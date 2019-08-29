import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GridsterConfig, GridType} from 'angular-gridster2';
import {DashboardItem} from './dashboard-item/dashboard-item';
import {SensorService} from '../shared/sensor/sensor.service';
import {DashboardItemsService} from './dashboard-items.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'hui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  options: GridsterConfig;

  items$: Observable<DashboardItem[]>;

  static itemChange(item, itemComponent) {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.info('itemResized', item, itemComponent);
  }

  constructor(private httpClient: HttpClient, private sensorService: SensorService, private dashboardItemsService: DashboardItemsService) {}

  ngOnInit() {
    this.options = {
      itemChangeCallback: DashboardComponent.itemChange,
      itemResizeCallback: DashboardComponent.itemResize,
      gridType: GridType.ScrollVertical,
      margin: 12,
      outerMargin: false,
      columns: 4,
      swapping: false,
      pushing: true,
      floating: true,
      maxCols: 4,
      minCols: 4,
      colWidth: 'auto',
      defaultSizeX: 1,
      defaultSizeY: 1,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false,
      }
    };


    this.items$ = this.dashboardItemsService.items$;
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item: DashboardItem) {
    this.dashboardItemsService.removeItem(item);
  }

  addItem(item: DashboardItem) {
    this.dashboardItemsService.addItem(item);
  }
}
