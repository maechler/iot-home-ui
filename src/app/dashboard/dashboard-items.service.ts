import { Injectable } from '@angular/core';
import {DashboardItem} from './dashboard-item/dashboard-item';
import {BehaviorSubject} from 'rxjs';
import {SensorService} from '../shared/sensor/sensor.service';

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

  createItem(unit: string, sensor: string, size?: string, type?: string, id?: string): DashboardItem {
    return new DashboardItem(unit, sensor, this.sensorService, size, type, id);
  }

  private readItemsFromStore() {
    const storageItems = localStorage.getItem(this.settingsStorageKey);

    if (storageItems) {
      const storedItems = JSON.parse(storageItems);

      const items = storedItems.map((item) => {
        const dashboardItem = this.createItem(item.unit, item.sensor, item.size, item.type, item.id);

        dashboardItem.setPosition(item.position);

        return dashboardItem;
      });

      this._items.next(items);
    }
  }

  public storeItems() {
    const storeItems = this.getItems().map((item) => {
      return {
        id: item.id,
        size: item.size$.getValue(),
        type: item.type,
        unit: item.unit,
        sensor: item.sensor,
        position: item.getPosition(),
      };
    });

    localStorage.setItem(this.settingsStorageKey, JSON.stringify(storeItems));
  }
}
