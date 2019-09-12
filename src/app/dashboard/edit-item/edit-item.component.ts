import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DashboardItem} from '../dashboard-item/dashboard-item';

export interface EditItemData {
  duration: string;
  size: string;
  color: string;
  item: DashboardItem;
}

@Component({
  selector: 'hui-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
  sizes = DashboardItem.sizes;
  durations = DashboardItem.durations;
  colors = ['red', 'green', 'blue', 'yellow'];

  constructor(public dialogRef: MatDialogRef<EditItemComponent>, @Inject(MAT_DIALOG_DATA) public data: EditItemData) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
