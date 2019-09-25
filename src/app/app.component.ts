import { Component } from '@angular/core';

@Component({
  selector: 'hui-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IoT Home UI';
  readonly year = (new Date()).getFullYear();
}
