import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsLogComponent } from './sms-log.component';

describe('SmsLogComponent', () => {
  let component: SmsLogComponent;
  let fixture: ComponentFixture<SmsLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmsLogComponent]
    });
    fixture = TestBed.createComponent(SmsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
