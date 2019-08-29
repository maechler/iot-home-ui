import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor() { }

  getValue(): number {
    return 43;
  }
}
