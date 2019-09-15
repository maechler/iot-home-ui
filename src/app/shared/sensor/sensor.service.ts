import {Injectable} from '@angular/core';
import {SettingsService} from '../../dashboard/settings/settings.service';
import {Sensor} from './sensor';
import {HttpClient} from '@angular/common/http';
import {Unit} from './unit';
import {BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, map } from 'rxjs/operators';
import {Measurement} from './measurement';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private _valueObservables = {};
  private _influxdbServer: string;
  private _influxdbDatabase: string;
  private _refreshRate: number;

  constructor(private _settingsService: SettingsService, private _httpClient: HttpClient, private _snackBar: MatSnackBar) {
    _settingsService.settings$.subscribe(this.handleSettingsChanged.bind(this));
    this.updateSettings();
  }

  fetchUnits(): Observable<Unit[]> {
    return this._httpClient.get<Unit[]>(this._influxdbServer + '/query', {
      params: {
        db: this._influxdbDatabase,
        q: 'SHOW MEASUREMENTS',
      }
    }).pipe(
      map( (response: any) => {
        const responseUnits = response.results[0].series[0].values;

        return responseUnits.map(value => {
          return {name: value[0]};
        });
      }),
      catchError( error => {
        this.handleError(error);
        return of([]);
      })
    );
  }

  fetchSensorsByUnit(unit?: string): Observable<Sensor[]> {
    return this._httpClient.get<Unit[]>(this._influxdbServer + '/query', {
      params: {
        db: this._influxdbDatabase,
        q: 'SHOW FIELD KEYS FROM ' + unit,
      }
    }).pipe(
      map( (response: any) => {
        const responseUnits = response.results[0].series[0].values;

        return responseUnits.map((sensor) => {
          return {name: sensor[0]};
        });
      }),
      catchError( error => {
        this.handleError(error);

        return of([]);
      })
    );
  }

  getSeriesObservable(unit: string, sensor: string, duration$: BehaviorSubject<string>): Observable<Measurement[]> {
    const observable = new BehaviorSubject(null);
    let currentTimeout = -1;

    const fetchSeries = (unit, sensor, duration$) => {
      this._httpClient.get<Unit[]>(this._influxdbServer + '/query', {
        params: {
          db: this._influxdbDatabase,
          q: 'SELECT MEAN(' + sensor + ') FROM ' + unit + ' WHERE time > now() - ' + duration$.getValue() + ' GROUP BY time(' + this.durationToGroupByTime(duration$.getValue()) + ')',
        }
      }).pipe(
        map((response: any) => response.results[0].series[0].values.map((value) => ({value: value[1], time: new Date(value[0])}))),
        catchError( error => {
          this.handleError(error);

          return of({value: 0, time: null});
        })
      ).subscribe((measurements) => {
        currentTimeout = setTimeout(() => {
          fetchSeries(unit, sensor, duration$);
        }, this._refreshRate * 1000);

        observable.next(measurements);
      });
    };

    duration$.subscribe(() => {
      clearTimeout(currentTimeout);
      fetchSeries(unit, sensor, duration$);
    });

    fetchSeries(unit, sensor, duration$);

    return observable;
  }

  getValueObservable(unit: string, sensor: string): Observable<Measurement> {
    if (this._valueObservables[this.getSensorKey(unit, sensor)] === undefined) {
      this._valueObservables[this.getSensorKey(unit, sensor)] = {
        unit: unit,
        sensor: sensor,
        observable: new BehaviorSubject(null),
        timeout: -1,
      };

      this.fetchValue(unit, sensor);
    }

    return this._valueObservables[this.getSensorKey(unit, sensor)].observable;
  }

   private fetchValue(unit, sensor) {
     const activeSensor = this._valueObservables[this.getSensorKey(unit, sensor)];

     this._httpClient.get<Unit[]>(this._influxdbServer + '/query', {
       params: {
         db: this._influxdbDatabase,
         q: 'SELECT ' + sensor + ' FROM ' + unit + ' ORDER BY DESC LIMIT 1 ',
       }
     }).pipe(
       map((response: any) => ({
         value: response.results[0].series[0].values[0][1],
         time: new Date(response.results[0].series[0].values[0][0])
       })),
       catchError( error => {
         this.handleError(error);
         return of({value: 0, time: null});
       })
     ).subscribe((measurement) => {
       this._valueObservables[this.getSensorKey(unit, sensor)].timeout = setTimeout(() => {
         this.fetchValue(unit, sensor);
       }, this._refreshRate * 1000);

       activeSensor.observable.next(measurement);
     });
  }

  private getSensorKey(unit, sensor, duration?) {
    return unit + '-' + sensor + (duration ? '-' + duration : '');
  }

  private updateSettings() {
    this._influxdbServer = this._settingsService.getSettings().influxdbServer.replace(/\/$/, '');
    this._influxdbDatabase = this._settingsService.getSettings().influxdbDatabase;
    this._refreshRate = this._settingsService.getSettings().refreshRate;
  }

  private handleError(error) {
    console.error(error);

    this._snackBar.open('An error happened reading from InfluxDB.', 'OK', {
      duration: 5000,
    });
  }

  private handleSettingsChanged() {
    this.updateSettings();

    Object.keys(this._valueObservables).forEach(key => {
      const sensor = this._valueObservables[key];

      clearTimeout(sensor.timeout);
      this.fetchValue(sensor.unit, sensor.sensor);
    });
  }

  private durationToGroupByTime(duration: string): string {
    switch (duration) {
      case '365d':
      case '180d':
        return '1d';
      case '30d':
        return '12h';
      case '14d':
        return '4h';
      case '7d':
        return '2h';
      case '1d':
        return '30m';
      case '12h':
        return '15m';
      case '4h':
        return '5m';
      case '60m':
      case '30m':
        return '30s';
      case '15m':
        return '10s';
      default:
        return '10s';
    }
  }
}
