import {DashboardItem, DashboardItemType, SerializedDashboardItem} from '../dashboard-item';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Measurement} from '../../../shared/sensor/measurement';

export interface SerializedValueDashboardItem extends SerializedDashboardItem {
  unit: string;
  sensor: string;
}

export class ValueDashboardItem extends DashboardItem {
  public readonly type = DashboardItemType.Value;

  unit: string;
  sensor: string;
  value$: Observable<Measurement>;

  protected readonly _valueSubject = new BehaviorSubject<Measurement>(null);
  protected _value$: Observable<Measurement>;
  protected _valueSubscription: Subscription;

  onComponentInit() {
    super.onComponentInit();
    this.setValueObservable();

    this.value$ = this._valueSubject.asObservable();
  }

  onComponentDestroy() {
    super.onComponentDestroy();

    this._valueSubscription.unsubscribe();
    this.value$ = null;
  }

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
    if (!this.isComponentInitialized) {
      return;
    }

    if (this._valueSubscription) {
      this._valueSubscription.unsubscribe();
    }

    this._valueSubject.next(null);

    this._value$ = this.sensorService.getValueObservable(this.unit, this.sensor);
    this._valueSubscription = this._value$.subscribe((measurement) => {
      if (measurement) {
        this._valueSubject.next(measurement);
      }
    });
  }
}
