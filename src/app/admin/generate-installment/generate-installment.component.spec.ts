import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInstallmentComponent } from './generate-installment.component';

describe('GenerateInstallmentComponent', () => {
  let component: GenerateInstallmentComponent;
  let fixture: ComponentFixture<GenerateInstallmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateInstallmentComponent]
    });
    fixture = TestBed.createComponent(GenerateInstallmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
