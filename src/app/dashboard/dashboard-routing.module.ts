import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {SettingsDialogEntryComponent} from './settings/settings-dialog-entry.component';
import {AddItemEntryComponent} from './add-item/add-item-entry.component';
import {EditItemEntryComponent} from './edit-item/edit-item-entry.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'settings', component: SettingsDialogEntryComponent},
      { path: 'add-item', component: AddItemEntryComponent},
      { path: 'edit-item/:id', component: EditItemEntryComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }