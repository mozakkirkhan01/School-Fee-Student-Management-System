import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeHeadComponent } from './fee-head.component';

describe('FeeHeadComponent', () => {
  let component: FeeHeadComponent;
  let fixture: ComponentFixture<FeeHeadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeHeadComponent]
    });
    fixture = TestBed.createComponent(FeeHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
