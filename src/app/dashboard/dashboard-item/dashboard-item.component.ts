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
        time: {
          max: new Date(),
        }
      }]
    }
  };

  chartColors = [
    {
      backgroundColor: 'rgba(242,196,48,0.5)',
      borderColor: 'rgba(242,196,48,0.5)',
      pointBackgroundColor: 'rgba(242,196,48,0.5)',
      pointBorderColor: 'rgba(242,196,48,0.75)',
      pointHoverBackgroundColor: 'rgba(242,196,48,0.75)',
      pointHoverBorderColor: 'rgba(242,196,48,0.75)',
    },
    {
      backgroundColor: 'rgba(42,99,140,0.5)',
      borderColor: 'rgba(42,99,140,0.5)',
      pointBackgroundColor: 'rgba(42,99,140,0.5)',
      pointBorderColor: 'rgba(42,99,140,0.75)',
      pointHoverBackgroundColor: 'rgba(42,99,140,0.75)',
      pointHoverBorderColor: 'rgba(42,99,140,0.75)',
    },
    {
      backgroundColor: 'rgba(208,20,49,0.5)',
      borderColor: 'rgba(208,20,49,0.5)',
      pointBackgroundColor: 'rgba(208,20,49,0.5)',
      pointBorderColor: 'rgba(208,20,49,0.75)',
      pointHoverBackgroundColor: 'rgba(208,20,49,0.75)',
      pointHoverBorderColor: 'rgba(208,20,49,0.75)',
    },
    {
      backgroundColor: 'rgba(93,182,77,0.5)',
      borderColor: 'rgba(93,182,77,0.5)',
      pointBackgroundColor: 'rgba(93,182,77,0.5)',
      pointBorderColor: 'rgba(93,182,77,0.75)',
      pointHoverBackgroundColor: 'rgba(93,182,77,0.75)',
      pointHoverBorderColor: 'rgba(93,182,77,0.75)',
    },
  ];

  @Input()
  private item: DashboardItem;

  @Output()
  delete = new EventEmitter<DashboardItem>();

  deleteItem($event, item: DashboardItem) {
    this.delete.emit(item);
  }

  mouseDown($event) {
    // Prevent gridster preview from showing up
    $event.stopPropagation();
  }
}
