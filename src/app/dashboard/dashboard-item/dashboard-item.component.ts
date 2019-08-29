import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DashboardItem} from './dashboard-item';

@Component({
  selector: 'hui-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent implements AfterViewChecked {
  @Input()
  private item: DashboardItem;

  @ViewChild('value') valueElement;
  @ViewChild('label') labelElement;
  @ViewChild('element') elementElement;

  private viewCheckedCalled = false;

  ngAfterViewChecked(): void {
    this.item.size$
      .subscribe((value) => {
        let fontsize = this.elementElement.nativeElement.getBoundingClientRect().height * .4;

        //console.log('size$ changed', value, this.elementElement.nativeElement.getBoundingClientRect(), this.elementElement.nativeElement.offsetHeight, fontsize);
        this.valueElement.nativeElement.style.fontSize = fontsize + 'px';
        this.valueElement.nativeElement.style.lineHeight = fontsize + 'px';
        this.labelElement.nativeElement.style.fontSize = (fontsize / 6) + 'px';

    });
  }


}
