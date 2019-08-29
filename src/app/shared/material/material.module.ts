import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule, MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  exports: [
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  declarations: []
})

export class MaterialModule { }
