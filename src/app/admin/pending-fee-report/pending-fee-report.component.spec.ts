import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFeeReportComponent } from './pending-fee-report.component';

describe('PendingFeeReportComponent', () => {
  let component: PendingFeeReportComponent;
  let fixture: ComponentFixture<PendingFeeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingFeeReportComponent]
    });
    fixture = TestBed.createComponent(PendingFeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
