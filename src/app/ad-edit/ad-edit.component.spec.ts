import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEditComponent } from './ad-edit.component';

describe('AdEditComponent', () => {
  let component: AdEditComponent;
  let fixture: ComponentFixture<AdEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
