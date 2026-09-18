import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMasterComponent } from './session-master.component';

describe('SessionMasterComponent', () => {
  let component: SessionMasterComponent;
  let fixture: ComponentFixture<SessionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionMasterComponent]
    });
    fixture = TestBed.createComponent(SessionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
