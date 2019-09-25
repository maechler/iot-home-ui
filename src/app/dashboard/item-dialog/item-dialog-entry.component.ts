import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardItemsService} from '../dashboard-items.service';
import {DashboardItem} from '../dashboard-item/dashboard-item';
import {EditItemDialogComponent} from './edit-item-dialog.component';
import {AddItemDialogComponent} from './add-item-dialog.component';

@Component({
  template: '',
})
export class ItemDialogEntryComponent {
  private item: DashboardItem;

  constructor(
    private itemDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardItemsService: DashboardItemsService
  ) {
    if (this.route.snapshot.paramMap.has('id')) {
      this.item = this.dashboardItemsService.getItemById(this.route.snapshot.paramMap.get('id'));
    }

    this.openItemDialog();
  }

  openItemDialog(): void {
    let dialogRef;

    if (this.item) {
      dialogRef = this.itemDialog.open(EditItemDialogComponent, {
        width: '600px',
        autoFocus: true,
        data: {
          item: this.item,
        }
      });
    } else {
      dialogRef = this.itemDialog.open(AddItemDialogComponent, {
        width: '600px',
        autoFocus: true,
      });
    }

    dialogRef.afterClosed().subscribe(_ => {
      this.router.navigate(['/dashboard'], { relativeTo: this.route });
    });
  }
}
