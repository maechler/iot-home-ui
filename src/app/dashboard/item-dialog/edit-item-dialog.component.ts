import {Component, OnInit} from '@angular/core';
import {DashboardItemType} from '../dashboard-item/dashboard-item';
import {ValueDashboardItem} from '../dashboard-item/value-dashboard-item/value-dashboard-item';
import {ChartDashboardItem} from '../dashboard-item/chart-dashboard-item/chart-dashboard-item';
import {ItemDialogComponent, ItemDialogType} from './item-dialog.component';

@Component({
  selector: 'hui-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class EditItemDialogComponent extends ItemDialogComponent implements OnInit {
  dialogType = ItemDialogType.Edit;
  title = 'Edit dashboard item';
  submitButtonText = 'Save item';

  ngOnInit() {
    super.ngOnInit();

    this.type.setValue(this.data.item.type);
    this.size.setValue(this.data.item.size$.getValue());

    if (this.data.item.type === DashboardItemType.Value) {
      const item = this.data.item as ValueDashboardItem;

      this.unit.setValue(item.unit);
      this.sensor.setValue(item.sensor);
    } else if (this.data.item.type === DashboardItemType.Chart) {
      const item = this.data.item as ChartDashboardItem;

      this.series = item.series.slice();
      this.duration.setValue(item.duration$.getValue());
    }
  }

  onFormSubmitClick() {
    super.onFormSubmitClick();

    if (this.validateForm()) {
      this.data.item.setSize(this.size.value);

      if (this.data.item.type === DashboardItemType.Value) {
        const item = this.data.item as ValueDashboardItem;

        item.setUnit(this.unit.value)
          .setSensor(this.sensor.value);
      } else if (this.data.item.type === DashboardItemType.Chart) {
        const item = this.data.item as ChartDashboardItem;

        item.setDuration(this.duration.value)
          .setSeries(this.series);
      }

      this._dashboardItemsService.storeItems();
      this._dialogRef.close();
    }
  }

  validateForm() {
    let isValid = this.validateField(this.size);

    if (this.data.item.type === DashboardItemType.Value) {
      isValid = isValid && this.validateField(this.unit) && this.validateField(this.sensor);
    } else if (this.data.item.type === DashboardItemType.Chart) {
      isValid = isValid && this.validateField(this.duration) && this.series.length > 0;
      this.showSeriesError = this.series.length === 0;
    }

    return isValid;
  }
}
