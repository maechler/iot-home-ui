import {DashboardItem, DashboardItemType, SerializedDashboardItem} from '../dashboard-item';
import {Observable} from 'rxjs';
import {Measurement} from '../../../shared/sensor/measurement';

export interface SerializedValueDashboardItem extends SerializedDashboardItem {
  unit: string;
  sensor: string;
}

export class ValueDashboardItem extends DashboardItem {
  public readonly type = DashboardItemType.Value;

  unit: string;
  sensor: string;
  measurement$: Observable<Measurement>;

  setUnit(unit: string): ValueDashboardItem {
    this.unit = unit;
    this.setValueObservable();
    return this;
  }

  setSensor(sensor: string): ValueDashboardItem {
    this.sensor = sensor;
    this.setValueObservable();
    return this;
  }

  public serialize(): SerializedValueDashboardItem {
    return {
      ...super.serialize(),
      unit: this.unit,
      sensor: this.sensor,
    };
  }

  protected setValueObservable() {
    if (this.unit && this.sensor) {
      this.measurement$ = this.sensorService.getValueObservable(this.unit, this.sensor);
    }
  }
}
