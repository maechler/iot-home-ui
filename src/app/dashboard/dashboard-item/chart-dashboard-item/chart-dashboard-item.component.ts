import {Component, Input, OnInit} from '@angular/core';
import {DashboardItemComponent} from '../dashboard-item.component';
import {Sensor} from '../../../shared/sensor/sensor';
import {ChartDashboardItem} from './chart-dashboard-item';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'hui-chart-dashboard-item',
  templateUrl: './chart-dashboard-item.component.html',
  styleUrls: ['./chart-dashboard-item.component.scss']
})
export class ChartDashboardItemComponent extends DashboardItemComponent implements OnInit {
  item$ = new ReplaySubject<ChartDashboardItem>(1);

  @Input()
  set item(item: ChartDashboardItem) {
    this.item$.next(item);
  }

  lineChartOptions = {};

  ngOnInit(): void {
    this.item$.subscribe((item) => {
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
              labelString: item.series.length > 0 ? '[' + Sensor.sensorUnits[item.series[0].sensor] + ']' : '',
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }

              label += tooltipItem.yLabel.toFixed(1);

              return label;
            }
          }
        }
      };
    });
  }
}
