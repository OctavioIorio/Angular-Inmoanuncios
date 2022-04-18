import { TestBed } from '@angular/core/testing';

import { IanuncioService } from './ianuncio.service';

describe('IanuncioService', () => {
  let service: IanuncioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IanuncioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
