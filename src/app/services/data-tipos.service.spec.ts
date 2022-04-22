import { TestBed } from '@angular/core/testing';

import { DataTiposService } from './data-tipos.service';

describe('DataTiposService', () => {
  let service: DataTiposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTiposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
