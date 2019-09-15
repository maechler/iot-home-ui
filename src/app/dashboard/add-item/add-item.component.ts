import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DashboardItem} from '../dashboard-item/dashboard-item';

export interface AddItemData {
  units: string[];
  selectedUnit: string;
  size: string;
  type: string;
  color: string;
}

@Component({
  selector: 'hui-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {
  types = DashboardItem.types;
  sizes = DashboardItem.sizes;
  colors = Object.keys(DashboardItem.colors);

  constructor(public dialogRef: MatDialogRef<AddItemComponent>, @Inject(MAT_DIALOG_DATA) public data: AddItemData) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
