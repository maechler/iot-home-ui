import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';
import {DashboardItem} from './dashboard-item/dashboard-item';
import {SensorService} from '../shared/sensor/sensor.service';

@Component({
  selector: 'hui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private sensors = new Array<DashboardItem>();


  ngOnInitoff() {
    /*setInterval(function() {
      this.httpClient.get('http://localhost:8086/query', {
        params: {
          pretty: 'true',
          db: 'iothome',
          q: 'SELECT * FROM iothome.DefaultPolicy.home_inside ORDER BY DESC LIMIT 1;',
        }
      }).subscribe(
        data  => {
          // data.results[0].series[0].values[1]
          this.sensors.humidity = data.results[0].series[0].values[0][1];
          this.sensors.pressure = data.results[0].series[0].values[0][2];
          this.sensors.temperature = data.results[0].series[0].values[0][3];
          console.log('success', data);
        },
        error  => {
          console.log('error', error);
        }
      );
    }.bind(this), 500);*/
  }

  options: GridsterConfig;

  static itemChange(item, itemComponent) {
    //console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    //console.info('itemResized', item, itemComponent);
  }

  constructor(private httpClient: HttpClient, private sensorService: SensorService) {}

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

    const item = new DashboardItem('humidity');
    const item2 = new DashboardItem('lorem');

    this.sensors.push(item);
    this.sensors.push(item2);
    this.sensors.push(new DashboardItem('pressure'));
    this.sensors.push(new DashboardItem('temperature'));

    item.setSize('2x2');
    item2.setSize('1x4');
    item2.setValue(this.sensorService.getValue())

    setTimeout(() => {
      item.setSize('1x1');
      this.options.api.optionsChanged();

      setTimeout(() => {
        item.setSize('1x1');
        this.options.api.optionsChanged();
      }, 2000);
    }, 2000);
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {
    this.sensors.splice(this.sensors.indexOf(item), 1);
  }

  addItem() {
    //this.dashboard.push({});
  }
}
