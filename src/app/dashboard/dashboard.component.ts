import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompactType, DisplayGrid, GridsterConfig, GridType} from 'angular-gridster2';
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

  itemChange() {
    this.dashboardItemsService.storeItems();

    setTimeout(() => {
      this.options.api.optionsChanged();
    });
  }

  constructor(private httpClient: HttpClient, private sensorService: SensorService, private dashboardItemsService: DashboardItemsService) {}

  ngOnInit() {
    this.options = {
      itemChangeCallback: this.itemChange.bind(this),
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
      compactType: CompactType.CompactUp,
      displayGrid: DisplayGrid.None,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false,
      }
    };

    this.items$ = this.dashboardItemsService.items$;
  }
}
