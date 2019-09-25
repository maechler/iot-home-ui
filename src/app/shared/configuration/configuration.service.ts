import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  defaultSnackBarDuration$ = new BehaviorSubject(5000);
}
