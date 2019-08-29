import { TestBed } from '@angular/core/testing';

import { DashboardItemsService } from './dashboard-items.service';

describe('DashboardItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardItemsService = TestBed.get(DashboardItemsService);
    expect(service).toBeTruthy();
  });
});
