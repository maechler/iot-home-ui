import {Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DashboardItem, DashboardItemColor, DashboardItemSeries, DashboardItemSize, DashboardItemType} from '../dashboard-item/dashboard-item';
import {Unit} from '../../shared/sensor/unit';
import {Observable, Subject} from 'rxjs';
import {Sensor} from '../../shared/sensor/sensor';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SensorService} from '../../shared/sensor/sensor.service';
import {DashboardItemsService} from '../dashboard-items.service';
import {ChartDashboardItem} from '../dashboard-item/chart-dashboard-item/chart-dashboard-item';
import {ConfigurationService} from '../../shared/configuration/configuration.service';

export interface ItemDialogData {
  item?: DashboardItem;
}

export enum ItemDialogType {
  Add,
  Edit,
}

export abstract class ItemDialogComponent implements OnInit {
  ItemDialogType = ItemDialogType;
  DashboardItemType = DashboardItemType;
  types = Object.values(DashboardItemType);
  sizes = Object.values(DashboardItemSize);
  colors = Object.values(DashboardItemColor);
  durations = ChartDashboardItem.durations;

  abstract dialogType: ItemDialogType;
  abstract title;
  abstract submitButtonText;

  units$: Observable<Unit[]>;
  sensors$ = new Subject<Sensor[]>();

  series = new Array<DashboardItemSeries>();
  showSeriesError = false;

  itemDialogForm: FormGroup;
  type = new FormControl('', Validators.required);
  unit = new FormControl('', Validators.required);
  sensor = new FormControl({value: '', disabled: true}, Validators.required);
  size = new FormControl('', Validators.required);
  color = new FormControl('', Validators.required);
  duration = new FormControl('', Validators.required);

  constructor(
    protected _dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: ItemDialogData,
    protected _fb: FormBuilder,
    protected _sensorService: SensorService,
    protected _dashboardItemsService: DashboardItemsService,
    protected _snackBar: MatSnackBar,
    protected _configurationServce: ConfigurationService,
  ) {}

  ngOnInit() {
    this.units$ = this._sensorService.fetchUnits();
    this.itemDialogForm = this._fb.group({
      type: this.type,
      unit: this.unit,
      sensor: this.sensor,
      size: this.size,
      color: this.color,
      duration: this.duration,
    });

    this.unit.valueChanges.subscribe((unit) => {
      this._sensorService.fetchSensorsByUnit(unit).subscribe((sensors) => {
        if (sensors) {
          this.sensors$.next(sensors);
          this.sensor.enable();
        }
      });
    });

    this.type.valueChanges.subscribe((type) => {
      if (type === DashboardItemType.Value) {
        this.color.disable();
        this.duration.disable();
      } else if (type === DashboardItemType.Chart) {
        this.color.enable();
        this.duration.enable();
      }
    });
  }

  addSeries() {
    if (this.unit.valid && this.sensor.valid && this.color.valid) {
      this.series.push({
        unit: this.unit.value,
        sensor: this.sensor.value,
        color: this.color.value,
      });
    } else {
      this.unit.markAsTouched();
      this.sensor.markAsTouched();
      this.color.markAsTouched();
    }
  }

  removeSeries(series: DashboardItemSeries) {
    this.series.splice(this.series.indexOf(series), 1);
  }

  onFormSubmitClick() {

  }

  onCloseClick() {
    this._dialogRef.close();
  }

  onDeleteClick() {
    this._dashboardItemsService.removeItem(this.data.item);
    this._dialogRef.close();
  }

  validateField(control: FormControl): boolean {
    if (control.valid) {
      return true;
    } else {
      control.markAsTouched();

      return false;
    }
  }
}
