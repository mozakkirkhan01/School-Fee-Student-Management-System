import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCollectionReportComponent } from './monthly-collection-report.component';

describe('MonthlyCollectionReportComponent', () => {
  let component: MonthlyCollectionReportComponent;
  let fixture: ComponentFixture<MonthlyCollectionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyCollectionReportComponent]
    });
    fixture = TestBed.createComponent(MonthlyCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
