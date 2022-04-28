import { TestBed } from '@angular/core/testing';

import { DataMunicipiosService } from './data-municipios.service';

describe('DataMunicipiosService', () => {
  let service: DataMunicipiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMunicipiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
