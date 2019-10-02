import {Injectable} from '@angular/core';
import {SettingsService} from '../../dashboard/settings/settings.service';
import {Sensor} from './sensor';
import {HttpClient} from '@angular/common/http';
import {Unit} from './unit';
import {BehaviorSubject, Observable, combineLatest, of, interval, timer} from 'rxjs';
import {catchError, map, switchMap, startWith, retryWhen, delayWhen, tap} from 'rxjs/operators';
import {Measurement} from './measurement';
import {MatSnackBar} from '@angular/material';
import {ConfigurationService} from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private _refreshRate$: Observable<number>;
  private _valueObservabels = new Map<string, Observable<Measurement>>();
  private _seriesObservabels = new Map<string, Observable<Measurement[]>>();

  constructor(
    private _settingsService: SettingsService,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private _configurationService: ConfigurationService,
  ) {
    this._refreshRate$ = _settingsService.settings$.pipe(map(settings => settings.refreshRate));
  }

  fetchUnits(): Observable<Unit[]> {
    return this._settingsService.settings$.pipe(
      switchMap((settings) => this._httpClient.get<Unit[]>(
        settings.influxdbServer + '/query',
        {
          params: {
            u: settings.influxdbUsername,
            p: settings.influxdbPassword,
            db: settings.influxdbDatabase,
            q: 'SHOW MEASUREMENTS',
          },
        }
      )),
      map( (response: any) => {
        const responseUnits = response.results[0].series[0].values;

        return responseUnits.map(value => ({name: value[0]}));
      }),
      catchError( error => {
        this.handleError(error);
        return of([]);
      })
    );
  }

  fetchSensorsByUnit(unit?: string): Observable<Sensor[]> {
    return this._settingsService.settings$.pipe(
      switchMap((settings) => this._httpClient.get<Unit[]>(
        settings.influxdbServer + '/query',
        {
          params: {
            u: settings.influxdbUsername,
            p: settings.influxdbPassword,
            db: settings.influxdbDatabase,
            q: 'SHOW FIELD KEYS FROM ' + unit,
          },
        }
      )),
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
    const observableKey = unit + '-' + sensor + '-' + duration$.getValue();

    if (!this._seriesObservabels.has(observableKey)) {
      const seriesObservable = this._refreshRate$.pipe(
        switchMap((refreshRate) => combineLatest([
          interval(refreshRate * 1000).pipe(startWith(0)),
          this._settingsService.settings$,
        ])),
        switchMap(([i, settings]) => this._httpClient.get<Unit[]>(
          settings.influxdbServer + '/query',
          {
            params: {
              u: settings.influxdbUsername,
              p: settings.influxdbPassword,
              db: settings.influxdbDatabase,
              q: 'SELECT MEAN(' + sensor + ') FROM ' + unit + ' WHERE time > now() - ' + duration$.getValue() + ' GROUP BY time(' + this.durationToGroupByTime(duration$.getValue()) + ')',
            },
          }
        )),
        map((response: any) => {
          if (response.results[0].hasOwnProperty('error')) {
            this.handleError(response.results[0].error);

            return [{value: 0, time: null}];
          }

          return response.results[0].series[0].values.map((value) => ({value: value[1], time: new Date(value[0])}));
        }),
        retryWhen(errors =>
          errors.pipe(
            tap(error => this.handleError(error)),
            delayWhen(val => timer(5000))
          )
        )
      );

      this._seriesObservabels.set(observableKey, seriesObservable);
    }

    return this._seriesObservabels.get(observableKey);
  }

  getValueObservable(unit: string, sensor: string): Observable<Measurement> {
    const observableKey = unit + '-' + sensor;

    if (!this._valueObservabels.has(observableKey)) {
      const valueObservable = this._refreshRate$.pipe(
        switchMap((refreshRate) => combineLatest([
          interval(refreshRate * 1000).pipe(startWith(0)),
          this._settingsService.settings$,
        ])),
        switchMap(([i, settings]) => this._httpClient.get<Unit[]>(
          settings.influxdbServer + '/query',
          {
            params: {
              u: settings.influxdbUsername,
              p: settings.influxdbPassword,
              db: settings.influxdbDatabase,
              q: 'SELECT ' + sensor + ' FROM ' + unit + ' ORDER BY DESC LIMIT 1 ',
            },
          }
        )),
        map((response: any) => {
          if (response.results[0].hasOwnProperty('error')) {
            this.handleError(response.results[0].error);

            return {value: 0, time: null};
          }

          return {
            value: response.results[0].series[0].values[0][1],
            time: new Date(response.results[0].series[0].values[0][0])
          };
        }),
        retryWhen(errors =>
          errors.pipe(
            tap(error => this.handleError(error)),
            delayWhen(val => timer(5000))
          )
        )
      );

      this._valueObservabels.set(observableKey, valueObservable);
    }

    return this._valueObservabels.get(observableKey);
  }

  private handleError(error) {
    console.error(error);

    let message = 'Oops, an error occurred reading from InfluxDB.';

    if (typeof error === 'string') {
      message += ' Error: ' + error;
    } else if (error.hasOwnProperty('message')) {
      message += ' Error: ' + error.message;
    }

    this._snackBar.open(message, 'OK', {
      duration: this._configurationService.defaultSnackBarDuration$.getValue(),
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
