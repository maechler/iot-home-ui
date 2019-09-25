import { Injectable } from '@angular/core';
import {DashboardItem, DashboardItemType, SerializedDashboardItem} from './dashboard-item/dashboard-item';
import {BehaviorSubject} from 'rxjs';
import {SensorService} from '../shared/sensor/sensor.service';
import {SerializedValueDashboardItem, ValueDashboardItem} from './dashboard-item/value-dashboard-item/value-dashboard-item';
import {ChartDashboardItem, SerializedChartDashboardItem} from './dashboard-item/chart-dashboard-item/chart-dashboard-item';

@Injectable({
  providedIn: 'root'
})
export class DashboardItemsService {
  private readonly _items = new BehaviorSubject<DashboardItem[]>([]);
  readonly items$ = this._items.asObservable();
  private readonly settingsStorageKey = 'hui.dashboard.items';

  constructor(private sensorService: SensorService) {
    this.readItemsFromStore();
  }

  addItem(item: DashboardItem) {
    this._items.next([
      ...this._items.getValue(),
      item
    ]);

    this.storeItems();
  }

  removeItem(item: DashboardItem) {
    const items = this._items.getValue();

    items.splice(items.indexOf(item), 1);

    this._items.next(items);
    this.storeItems();
  }

  getItems(): DashboardItem[] {
    return this._items.getValue();
  }

  getItemById(id: string): DashboardItem {
    for (const item of this.getItems()) {
      if (item.id === id) {
        return item;
      }
    }

    return null;
  }

  createItem(serializedDashboardItem: SerializedDashboardItem): DashboardItem {
    let item: DashboardItem;

    switch (serializedDashboardItem.type) {
      case DashboardItemType.Value:
        const valueItem = new ValueDashboardItem(serializedDashboardItem.id) as ValueDashboardItem;
        const serializedValueDashboardItem = serializedDashboardItem as SerializedValueDashboardItem;

        valueItem.unit = serializedValueDashboardItem.unit;
        valueItem.sensor = serializedValueDashboardItem.sensor;

        item = valueItem;
        break;
      case DashboardItemType.Chart:
        const chartItem = new ChartDashboardItem(serializedDashboardItem.id);
        const serializedChartDashboardItem = serializedDashboardItem as SerializedChartDashboardItem;

        chartItem.setDuration(serializedChartDashboardItem.duration)
                 .setSeries(serializedChartDashboardItem.series);

        item = chartItem;
        break;
      default:
        item =  null;
    }

    if (item) {
      item.setSensorService(this.sensorService)
          .setSize(serializedDashboardItem.size)
          .setPosition(serializedDashboardItem.position);
    }

    return item;
  }

  private readItemsFromStore() {
    const storageItems = localStorage.getItem(this.settingsStorageKey);

    if (storageItems) {
      const storedItems = JSON.parse(storageItems);
      const items = storedItems.map(this.createItem.bind(this));

      this._items.next(items);
    }
  }

  public storeItems() {
    const storeItems = this.getItems().map((item) => item.serialize());

    localStorage.setItem(this.settingsStorageKey, JSON.stringify(storeItems));
  }
}
