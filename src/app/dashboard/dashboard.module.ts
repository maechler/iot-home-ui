import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {MaterialModule} from '../shared/material/material.module';
import {GridsterModule} from 'angular-gridster2';
import {DashboardComponent} from './dashboard.component';
import {DashboardItemComponent} from './dashboard-item/dashboard-item.component';
import { SettingsDialogComponent } from './settings/settings-dialog.component';
import { SettingsDialogEntryComponent } from './settings/settings-dialog-entry.component';
import { ItemDialogEntryComponent } from './item-dialog/item-dialog-entry.component';
import {ChartsModule} from 'ng2-charts';
import { ValueDashboardItemComponent } from './dashboard-item/value-dashboard-item/value-dashboard-item.component';
import { ChartDashboardItemComponent } from './dashboard-item/chart-dashboard-item/chart-dashboard-item.component';
import {EditItemDialogComponent} from './item-dialog/edit-item-dialog.component';
import {AddItemDialogComponent} from './item-dialog/add-item-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    GridsterModule,
    DashboardRoutingModule,
    ChartsModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardItemComponent,
    SettingsDialogComponent,
    SettingsDialogEntryComponent,
    EditItemDialogComponent,
    AddItemDialogComponent,
    ItemDialogEntryComponent,
    ValueDashboardItemComponent,
    ChartDashboardItemComponent,
  ],
  entryComponents: [SettingsDialogComponent, EditItemDialogComponent, AddItemDialogComponent],
})
export class DashboardModule { }
