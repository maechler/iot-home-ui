import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDashboardItemComponent } from './chart-dashboard-item.component';

describe('ChartDashboardItemComponent', () => {
  let component: ChartDashboardItemComponent;
  let fixture: ComponentFixture<ChartDashboardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDashboardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDashboardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
