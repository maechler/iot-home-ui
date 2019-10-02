import {Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DashboardItem, DashboardItemType} from './dashboard-item';
import {Sensor} from '../../shared/sensor/sensor';

@Component({
  selector: 'hui-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss'],
})
export class DashboardItemComponent implements OnInit {
  sensorUnits = Sensor.sensorUnits;
  DashboardItemType = DashboardItemType;

  @Input()
  item: DashboardItem;

  @Output()
  itemChange = new EventEmitter();

  @Input() class = '';
  @HostBinding('class')
  get hostClasses(): string {
    return [
      this.class,
      this.item ? 'hui-dashboard-item-size-' + this.item.size$.getValue() : '',
    ].join(' ');
  }

  ngOnInit(): void {
    this.item.size$.subscribe(() => {
      this.itemChange.emit(this.item);
    });
  }
}
