import {Component, Input, OnInit} from '@angular/core';
import {DashboardItem} from './dashboard-item';

@Component({
  selector: 'hui-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent implements OnInit {
  sensorUnits = DashboardItem.sensorUnits;
  lineChartOptions = {};

  @Input()
  private item: DashboardItem;

  ngOnInit(): void {
    this.lineChartOptions = {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '[' + DashboardItem.sensorUnits[this.item.sensor] + ']'
          }
        }]
      }
    };
  }
}
