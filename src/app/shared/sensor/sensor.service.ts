import {Injectable} from '@angular/core';
import {SettingsService} from '../../dashboard/settings/settings.service';
import {Sensor} from './sensor';
import {HttpClient} from '@angular/common/http';
import {Unit} from './unit';
import {BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Measurement} from './measurement';
import {MatSnackBar} from '@angular/material';
import {ConfigurationService} from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private _influxdbServer: string;
  private _influxdbDatabase: string;
  private _refreshRate: number;

  constructor(
    private _settingsService: SettingsService,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private _configurationService: ConfigurationService,
  ) {
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
    return this._httpClient.get<Sensor[]>(this._influxdbServer + '/query', {
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
    const seriesSubject = new BehaviorSubject(null);
    let currentTimeout = -1;

    const fetchSeries = () => {
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
        seriesSubject.next(measurements);

        if (seriesSubject.observers.length > 0) {
          currentTimeout = setTimeout(fetchSeries, this._refreshRate * 1000);
        }
      });
    };

    duration$.subscribe(() => {
      clearTimeout(currentTimeout);
      fetchSeries();
    });

    this._settingsService.settings$.subscribe(() => {
      clearTimeout(currentTimeout);
      fetchSeries();
    });

    fetchSeries();

    return seriesSubject.asObservable();
  }

  getValueObservable(unit: string, sensor: string): Observable<Measurement> {
    const valueSubject = new BehaviorSubject(null);
    let currentTimeout = -1;

    const  fetchValue = () => {
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
        valueSubject.next(measurement);

        if (valueSubject.observers.length > 0) {
          currentTimeout = setTimeout(fetchValue, this._refreshRate * 1000);
        }
      });
    };

    this._settingsService.settings$.subscribe(() => {
      clearTimeout(currentTimeout);
      fetchValue();
    });

    fetchValue();

    return valueSubject.asObservable();
  }

  private updateSettings() {
    this._influxdbServer = this._settingsService.getSettings().influxdbServer.replace(/\/$/, '');
    this._influxdbDatabase = this._settingsService.getSettings().influxdbDatabase;
    this._refreshRate = this._settingsService.getSettings().refreshRate;
  }

  private handleError(error) {
    console.error(error);

    this._snackBar.open('An error happened reading from InfluxDB.', 'OK', {
      duration: this._configurationService.defaultSnackBarDuration$.getValue(),
    });
  }

  private handleSettingsChanged() {
    this.updateSettings();
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
        return '1m';
      case '30m':
        return '30s';
      case '15m':
        return '10s';
      default:
        return '10s';
    }
  }
}
