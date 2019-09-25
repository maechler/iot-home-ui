import {
  DashboardItem,
  DashboardItemSeries,
  DashboardItemType, SerializedDashboardItem
} from '../dashboard-item';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ChartDataSets} from 'chart.js';

export interface SerializedChartDashboardItem extends SerializedDashboardItem {
  series: DashboardItemSeries[];
  duration: string;
}

export class ChartDashboardItem extends DashboardItem {
  public static durations = ['365d', '180d', '30d', '14d', '7d', '1d', '12h', '4h', '60m', '30m', '15m'];

  static colors = {
    yellow: {
      backgroundColor: 'rgba(242,196,48,0.2)',
      borderColor: 'rgba(242,196,48,0.5)',
      pointBackgroundColor: 'rgba(242,196,48,0.75)',
      pointBorderColor: 'rgba(242,196,48,0.75)',
      pointHoverBackgroundColor: 'rgba(242,196,48,0.75)',
      pointHoverBorderColor: 'rgba(242,196,48,0.75)',
    },
    blue: {
      backgroundColor: 'rgba(42,99,140,0.2)',
      borderColor: 'rgba(42,99,140,0.5)',
      pointBackgroundColor: 'rgba(42,99,140,0.75)',
      pointBorderColor: 'rgba(42,99,140,0.75)',
      pointHoverBackgroundColor: 'rgba(42,99,140,0.75)',
      pointHoverBorderColor: 'rgba(42,99,140,0.75)',
    },
    red: {
      backgroundColor: 'rgba(208,20,49,0.2)',
      borderColor: 'rgba(208,20,49,0.5)',
      pointBackgroundColor: 'rgba(208,20,49,0.75)',
      pointBorderColor: 'rgba(208,20,49,0.75)',
      pointHoverBackgroundColor: 'rgba(208,20,49,0.75)',
      pointHoverBorderColor: 'rgba(208,20,49,0.75)',
    },
    green: {
      backgroundColor: 'rgba(93,182,77,0.2)',
      borderColor: 'rgba(93,182,77,0.5)',
      pointBackgroundColor: 'rgba(93,182,77,0.75)',
      pointBorderColor: 'rgba(93,182,77,0.75)',
      pointHoverBackgroundColor: 'rgba(93,182,77,0.75)',
      pointHoverBorderColor: 'rgba(93,182,77,0.75)',
    },
  };

  chartDataSets: ChartDataSets[];
  labels: Array<Date>;
  readonly type = DashboardItemType.Chart;
  protected readonly _seriesSubscriptions = new Array<Subscription>();
  series = new Array<DashboardItemSeries>();
  duration$ = new BehaviorSubject('7d');

  addSeries(series: DashboardItemSeries): DashboardItem {
    this.series.push(series);
    this.setSeriesObservable();

    return this;
  }

  removeSeries(series: DashboardItemSeries) {
    this.series.splice(this.series.indexOf(series), 1);
    this.setSeriesObservable();

    return this;
  }

  setDuration(duration: string) {
    this.duration$.next(duration);
    this.setSeriesObservable();

    return this;
  }

  setSeries(series: DashboardItemSeries[]) {
    this.series = series;

    this.setSeriesObservable();

    return this;
  }

  onComponentInit() {
    super.onComponentInit();
    this.setSeriesObservable();
  }

  onComponentDestroy() {
    super.onComponentDestroy();
    this._seriesSubscriptions.forEach((seriesSubscription) => seriesSubscription.unsubscribe());
  }

  protected setSeriesObservable() {
    if (!this.isComponentInitialized) {
      return;
    }

    this._seriesSubscriptions.forEach((seriesSubscription) => seriesSubscription.unsubscribe());
    this.chartDataSets = [];

    for (const series of this.series) {
      const series$ = this.sensorService.getSeriesObservable(series.unit, series.sensor, this.duration$);
      const chartDataSet = {
        ...ChartDashboardItem.colors[series.color],
        data: [],
        label: series.sensor + ' - ' + series.unit,
        // fill: false,
      };

      this._seriesSubscriptions.push(series$.subscribe((measurements) => {
        if (measurements) {
          this.labels = measurements.map(measurement => measurement.time);
          chartDataSet.data = measurements.map(measurement => ({t: measurement.time, y: measurement.value}));
        }
      }));

      this.chartDataSets.push(chartDataSet);
    }
  }

  public serialize(): SerializedChartDashboardItem {
    return {
      ...super.serialize(),
      duration: this.duration$.getValue(),
      series: this.series,
    };
  }
}
