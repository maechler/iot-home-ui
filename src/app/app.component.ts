import { Component } from '@angular/core';

@Component({
  selector: 'hui-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IoT Home UI';
  year = (new Date()).getFullYear();
}
