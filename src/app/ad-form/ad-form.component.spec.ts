import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdFormComponent } from './ad-form.component';

describe('AdFormComponent', () => {
  let component: AdFormComponent;
  let fixture: ComponentFixture<AdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
