import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {MaterialModule} from '../shared/material/material.module';
import {GridsterModule} from 'angular-gridster2';
import {DashboardComponent} from './dashboard.component';
import {DashboardItemComponent} from './dashboard-item/dashboard-item.component';
import { SettingsDialogComponent } from './settings/settings-dialog.component';
import { SettingsDialogEntryComponent } from './settings/settings-dialog-entry.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddItemEntryComponent } from './add-item/add-item-entry.component';
import {ChartsModule} from 'ng2-charts';
import {EditItemComponent} from './edit-item/edit-item.component';
import {EditItemEntryComponent} from './edit-item/edit-item-entry.component';

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
    AddItemComponent,
    AddItemEntryComponent,
    EditItemComponent,
    EditItemEntryComponent,
  ],
  entryComponents: [SettingsDialogComponent, AddItemComponent, EditItemComponent],
})
export class DashboardModule { }
