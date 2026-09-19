import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddressComponent } from './student-address.component';

describe('StudentAddressComponent', () => {
  let component: StudentAddressComponent;
  let fixture: ComponentFixture<StudentAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAddressComponent]
    });
    fixture = TestBed.createComponent(StudentAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
