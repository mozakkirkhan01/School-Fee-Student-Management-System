import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeReminderSmsComponent } from './fee-reminder-sms.component';

describe('FeeReminderSmsComponent', () => {
  let component: FeeReminderSmsComponent;
  let fixture: ComponentFixture<FeeReminderSmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeReminderSmsComponent]
    });
    fixture = TestBed.createComponent(FeeReminderSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
