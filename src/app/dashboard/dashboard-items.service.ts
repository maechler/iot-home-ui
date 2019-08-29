import { Injectable } from '@angular/core';
import {DashboardItem} from './dashboard-item/dashboard-item';
import {BehaviorSubject} from 'rxjs';
import {Settings} from './settings/settings-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardItemsService {
  private readonly _items = new BehaviorSubject<DashboardItem[]>([]);
  readonly items$ = this._items.asObservable();
  private readonly settingsStorageKey = 'dashboard.items';

  constructor() {
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
    this._items.next(this._items.getValue().filter(i => i === item));
  }

  getItems(): DashboardItem[] {
    return this._items.getValue();
  }

  private readItemsFromStore() {
    const storageItems = localStorage.getItem(this.settingsStorageKey);

    if (storageItems) {
      const storedItems = JSON.parse(storageItems);

      const items = storedItems.map((item) => {
        const dashboardItem = new DashboardItem(item.name, item.size, item.type);

        dashboardItem.setPosition(item.position);

        return dashboardItem;
      });

      this._items.next(items);
    }
  }

  public storeItems() {
    const storeItems = this.getItems().map((item) => {
      return {
        size: item.size$.getValue(),
        type: item.type,
        name: item.name,
        position: item.getPosition(),
      };
    });

    localStorage.setItem(this.settingsStorageKey, JSON.stringify(storeItems));
  }
}
