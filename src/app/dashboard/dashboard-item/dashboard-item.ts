import {GridsterItem} from 'angular-gridster2';
import {isNumeric} from 'rxjs/internal-compatibility';
import {BehaviorSubject} from 'rxjs';

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

  value = 42.0;

  size$ = new BehaviorSubject('1x1');

  public constructor(public name, size?: string, public type = 'value') {
    if (size) {
      this.setSize(size);
    }
  }

  public setValue(value: number): void {
    this.value = value;
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
