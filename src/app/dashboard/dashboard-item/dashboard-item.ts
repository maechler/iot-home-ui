import {GridsterItem} from 'angular-gridster2';
import {isNumeric} from 'rxjs/internal-compatibility';
import {BehaviorSubject} from 'rxjs';
import {SensorService} from '../../shared/sensor/sensor.service';
import * as uuid from 'uuid';

export interface DashboardItemPosition {
  x: number;
  y: number;
}

export enum DashboardItemColor {
  Yellow = 'yellow',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}

export enum DashboardItemSize {
  OneOne = '1x1',
  TwoTwo = '2x2',
  OneTwo = '1x2',
  OneThree = '1x3',
  OneFour = '1x4',
}

export enum DashboardItemType {
  Value = 'value',
  Chart = 'chart',
}

export interface SerializedDashboardItem {
  id?: string;
  type: string;
  size?: DashboardItemSize;
  position?: DashboardItemPosition;
}

export interface DashboardItemSeries {
  unit: string;
  sensor: string;
  color: DashboardItemColor;
}

export abstract class DashboardItem implements GridsterItem {
  cols = 1;
  rows = 1;
  x = 0;
  y = 0;

  maxSizeX = 1;
  maxSizeY = 1;
  minSizeX = 1;
  minSizeY = 1;

  size$ = new BehaviorSubject(DashboardItemSize.OneOne);

  protected sensorService: SensorService;
  protected isComponentInitialized = false;

  public abstract type: DashboardItemType;

  public constructor(public readonly id?: string) {
    if (!id) {
      this.id = uuid.v4();
    }
  }

  setSensorService(sensorService: SensorService): DashboardItem {
    this.sensorService = sensorService;

    return this;
  }

  public setSize(size: DashboardItemSize): DashboardItem {
    if (!size) {
      console.error('Could not set dashboard item size$. Invalid size$ "' + size + '" provided.');

      return this;
    }

    const [rows, cols] = size.split('x').map(Number);

    if (!isNumeric(rows) || !isNumeric(cols)) {
      console.error('Could not set dashboard item size$. Invalid size$ "' + size + '" provided.');

      return this;
    }

    this.size$.next(size);

    this.rows = rows;
    this.cols = cols;
    this.maxSizeX = cols;
    this.maxSizeY = rows;
    this.minSizeX = cols;
    this.minSizeY = rows;

    return this;
  }

  public getPosition(): DashboardItemPosition {
    return {x: this.x, y: this.y};
  }

  public setPosition(position: DashboardItemPosition): DashboardItem {
    if (position) {
      this.x = position.x;
      this.y = position.y;
    }

    return this;
  }

  public serialize(): SerializedDashboardItem {
    return {
      id: this.id,
      type: this.type,
      size: this.size$.getValue(),
      position: this.getPosition(),
    };
  }

  public onComponentInit() {
    this.isComponentInitialized = true;
  }

  public onComponentDestroy() {
    this.isComponentInitialized = false;
  }
}
