import {Component, Input} from '@angular/core';
import {DashboardItemComponent} from '../dashboard-item.component';
import {ValueDashboardItem} from './value-dashboard-item';

@Component({
  selector: 'hui-value-dashboard-item',
  templateUrl: './value-dashboard-item.component.html',
  styleUrls: ['./value-dashboard-item.component.scss']
})
export class ValueDashboardItemComponent extends DashboardItemComponent {
  @Input()
  item: ValueDashboardItem;
}
