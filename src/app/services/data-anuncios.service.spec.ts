import { TestBed } from '@angular/core/testing';

import { DataAnunciosService } from './data-anuncios.service';

describe('DataAnunciosService', () => {
  let service: DataAnunciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAnunciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
