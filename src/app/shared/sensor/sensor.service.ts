import { Injectable } from '@angular/core';
import {SettingsService} from '../../dashboard/settings/settings.service';
import {Sensor} from './sensor';
import {HttpClient} from '@angular/common/http';
import {Unit} from './unit';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(private settingsService: SettingsService, private httpClient: HttpClient) {}

  fetchAllUnits(): Observable<Unit[]> {
    const influxdbServer = this.settingsService.getSettings().influxdbServer.replace(/\/$/, '');
    const influxdbDatabase = this.settingsService.getSettings().influxdbDatabase;

    return this.httpClient.get<Unit[]>(influxdbServer + '/query', {
      params: {
        db: influxdbDatabase,
        q: 'SHOW MEASUREMENTS',
      }
    }).pipe(
      map( response => {
        const responseUnits = response.results[0].series[0].values[0];

        return responseUnits.map((name) => {
          return {name: name};
        });
      })
    );
  }

  fetchAllSensors(): Sensor[] {
    const influxdbServer = this.settingsService.getSettings().influxdbServer;

    return null;
  }

  getValue(): number {
    return 43;
  }
}
