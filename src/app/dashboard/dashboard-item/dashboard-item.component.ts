import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DashboardItem} from './dashboard-item';

@Component({
  selector: 'hui-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent {
  @Input()
  private item: DashboardItem;

  @Output()
  delete = new EventEmitter<DashboardItem>();

  deleteItem($event, item: DashboardItem) {
    this.delete.emit(item);
  }

  mouseDown($event) {
    // Prevent gridster preview from showing up
    $event.stopPropagation();
  }
}
