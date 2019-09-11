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
  private _activeSensors = {};
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
        const responseUnits = response.results[0].series[0].values[0];

        return responseUnits.map(name => {
          return {name: name};
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

  getSensorObservable(unit: string, sensor: string): Observable<Measurement> {
    if (this._activeSensors[this.getSensorKey(unit, sensor)] === undefined) {
      this._activeSensors[this.getSensorKey(unit, sensor)] = {
        unit: unit,
        sensor: sensor,
        observable: new BehaviorSubject(null),
        timeout: -1,
      };

      this.makeRequest(unit, sensor);
    }

    return this._activeSensors[this.getSensorKey(unit, sensor)].observable;
  }

   private makeRequest(unit, sensor) {
     const activeSensor = this._activeSensors[this.getSensorKey(unit, sensor)];

     this._httpClient.get<Unit[]>(this._influxdbServer + '/query', {
       params: {
         db: this._influxdbDatabase,
         q: 'SELECT ' + sensor + ' FROM ' + unit + ' ORDER BY DESC LIMIT 1 ',
       }
     }).pipe(
       map((response: any) => {
         return {
           value: response.results[0].series[0].values[0][1],
           time: new Date(response.results[0].series[0].values[0][0])
         };
       }),
       catchError( error => {
         this.handleError(error);
         return of({value: 0, time: null});
       })
     ).subscribe((measurement) => {
       this._activeSensors[this.getSensorKey(unit, sensor)].timeout = setTimeout(() => {
         this.makeRequest(unit, sensor);
       }, this._refreshRate * 1000);

       activeSensor.observable.next(measurement);
     });
  }

  private getSensorKey(unit, sensor) {
    return unit + '-' + sensor;
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

    Object.keys(this._activeSensors).forEach(key => {
      const sensor = this._activeSensors[key];

      clearTimeout(sensor.timeout);
      this.makeRequest(sensor.unit, sensor.sensor);
    });
  }
}
