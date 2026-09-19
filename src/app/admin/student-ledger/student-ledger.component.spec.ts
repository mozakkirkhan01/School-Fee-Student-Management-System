import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLedgerComponent } from './student-ledger.component';

describe('StudentLedgerComponent', () => {
  let component: StudentLedgerComponent;
  let fixture: ComponentFixture<StudentLedgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentLedgerComponent]
    });
    fixture = TestBed.createComponent(StudentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
