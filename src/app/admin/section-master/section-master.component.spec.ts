import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionMasterComponent } from './section-master.component';

describe('SectionMasterComponent', () => {
  let component: SectionMasterComponent;
  let fixture: ComponentFixture<SectionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionMasterComponent]
    });
    fixture = TestBed.createComponent(SectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
