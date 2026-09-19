import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineRuleComponent } from './fine-rule.component';

describe('FineRuleComponent', () => {
  let component: FineRuleComponent;
  let fixture: ComponentFixture<FineRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FineRuleComponent]
    });
    fixture = TestBed.createComponent(FineRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
