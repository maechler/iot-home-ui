import {Component, OnInit} from '@angular/core';
import {DashboardItem, DashboardItemType} from '../dashboard-item/dashboard-item';
import {SerializedValueDashboardItem} from '../dashboard-item/value-dashboard-item/value-dashboard-item';
import {SerializedChartDashboardItem} from '../dashboard-item/chart-dashboard-item/chart-dashboard-item';
import {ItemDialogComponent, ItemDialogType} from './item-dialog.component';

@Component({
  selector: 'hui-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class AddItemDialogComponent extends ItemDialogComponent implements OnInit {
  dialogType = ItemDialogType.Add;
  title = 'Add dashboard item';
  submitButtonText = 'Add new item';

  onFormSubmitClick() {
    super.onFormSubmitClick();

    if (this.validateForm()) {
      let item: DashboardItem;

      if (this.type.value === DashboardItemType.Value) {
        item = this._dashboardItemsService.createItem({
          type: this.type.value,
          unit: this.unit.value,
          sensor: this.sensor.value,
          size: this.size.value,
        } as SerializedValueDashboardItem);
      } else if (this.type.value === DashboardItemType.Chart) {
        if (this.series.length === 0) {
          this._snackBar.open('You must add at least one series!', '', {
            duration: this._configurationServce.defaultSnackBarDuration$.getValue(),
          });

          return;
        }

        item = this._dashboardItemsService.createItem({
          type: this.type.value,
          duration: this.duration.value,
          series: this.series.map((series) => ({
            unit: series.unit,
            sensor: series.sensor,
            color: series.color,
          })),
          size: this.size.value,
        } as SerializedChartDashboardItem);
      }

      if (item) {
        this._dashboardItemsService.addItem(item);
      }

      this._snackBar.open('New dashboard item added successfully.', 'OK', {
        duration: this._configurationServce.defaultSnackBarDuration$.getValue(),
      });

      this._dialogRef.close();
    }
  }

  validateForm() {
    let isValid = this.validateField(this.size);

    if (this.type.value === DashboardItemType.Value) {
      isValid = isValid && this.validateField(this.unit) && this.validateField(this.sensor);
    } else if (this.type.value === DashboardItemType.Chart) {
      isValid = isValid && this.validateField(this.duration) && this.series.length > 0;
      this.showSeriesError = this.series.length === 0;
    }

    return isValid;
  }
}
