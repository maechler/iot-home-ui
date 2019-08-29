import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface AddItemData {
  units: string[];
  selectedUnit: string;
  size: string;
}

@Component({
  selector: 'hui-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {

  constructor(public dialogRef: MatDialogRef<AddItemComponent>, @Inject(MAT_DIALOG_DATA) public data: AddItemData) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
