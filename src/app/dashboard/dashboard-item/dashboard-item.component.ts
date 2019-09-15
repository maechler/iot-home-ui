import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DashboardItem} from './dashboard-item';

@Component({
  selector: 'hui-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent {
  sensorUnits = DashboardItem.sensorUnits;

  lineChartOptions = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
      }]
    }
  };

  @Input()
  private item: DashboardItem;
}
