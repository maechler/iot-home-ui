import {GridsterItem} from 'angular-gridster2';
import {isNumeric} from 'rxjs/internal-compatibility';
import {BehaviorSubject, Observable} from 'rxjs';
import {SensorService} from '../../shared/sensor/sensor.service';
import {Measurement} from '../../shared/sensor/measurement';
import {ChartDataSets} from 'chart.js';
import * as uuid from 'uuid';

export interface DashboardItemPosition {
  x: number;
  y: number;
}

export class DashboardItem implements GridsterItem {
  // TODO change to enums
  public static sizes = ['1x1', '2x2', '1x2', '1x3', '1x4'];
  public static types = ['value', 'chart'];
  public static durations = ['365d', '180d', '30d', '14d', '7d', '1d', '12h', '4h', '60m', '30m', '15m'];
  public static sensorUnits = {
    humidity: 'AH',
    temperature: 'C',
    pressure: 'Pa',
    earth: 'mg/L',
    light: 'lux',
  };

  cols = 1;
  rows = 1;
  x = 0;
  y = 0;

  maxSizeX = 1;
  maxSizeY = 1;
  minSizeX = 1;
  minSizeY = 1;

  size$ = new BehaviorSubject('1x1');
  value$: Observable<Measurement>;
  series$: Observable<Measurement[]>;
  series: ChartDataSets[];
  labels: Array<Date>;
  duration$ = new BehaviorSubject('7d');

  public constructor(public unit: string, public sensor: string, private sensorService: SensorService, size?: string, public type = 'value', public id?: string) {
    if (size) {
      this.setSize(size);
    }

    this.series = [{data: [], label: unit + '-' + sensor}];

    if (!id) {
      this.id = uuid.v4();
    }

    switch (type) {
      case 'chart':
        this.series$ = this.sensorService.getSeriesObservable(unit, sensor, this.duration$);
        this.series$.subscribe((measurements) => {
          if (measurements) {
            this.labels = measurements.map(measurement => measurement.time);
            this.series = [{data: measurements.map(measurement => ({t: measurement.time, y: measurement.value})), label: unit + '-' + sensor}];
          }
        });
        break;
      case 'value':
      default:
        this.value$ = this.sensorService.getValueObservable(unit, sensor);
    }
  }

  public setDuration(duration: string): void {
    this.duration$.next(duration);
  }

  public setSize(size: string): void {
    const [rows, cols] = size.split('x').map(Number);

    if (!isNumeric(rows) || !isNumeric(cols)) {
      console.error('Could not set dashboard item size$. Invalid size$ "' + size + '" provided.');
      return;
    }

    this.size$.next(size);

    this.rows = rows;
    this.cols = cols;
    this.maxSizeX = cols;
    this.maxSizeY = rows;
    this.minSizeX = cols;
    this.minSizeY = rows;
  }

  public getPosition(): DashboardItemPosition {
    return {x: this.x, y: this.y};
  }

  public setPosition(newPosition: DashboardItemPosition) {
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}
