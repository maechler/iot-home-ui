import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueDashboardItemComponent } from './value-dashboard-item.component';

describe('ValueDashboardItemComponent', () => {
  let component: ValueDashboardItemComponent;
  let fixture: ComponentFixture<ValueDashboardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueDashboardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueDashboardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
