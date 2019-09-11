import {GridsterItem} from 'angular-gridster2';
import {isNumeric} from 'rxjs/internal-compatibility';
import {BehaviorSubject, Observable} from 'rxjs';
import {SensorService} from '../../shared/sensor/sensor.service';
import {Measurement} from '../../shared/sensor/measurement';

export interface DashboardItemPosition {
  x: number;
  y: number;
}

export class DashboardItem implements GridsterItem {
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

  public constructor(public unit: string, public sensor: string, private sensorService: SensorService, size?: string, public type = 'value') {
    if (size) {
      this.setSize(size);
    }

    switch (type) {
      case 'value':
      default:
        this.value$ = this.sensorService.getSensorObservable(unit, sensor);
    }
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
