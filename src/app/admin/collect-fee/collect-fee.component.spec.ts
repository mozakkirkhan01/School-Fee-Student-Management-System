import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CollectFeeComponent } from './collect-fee.component';
import { ProgressComponent } from '../../component/progress/progress.component';
import { MaterialModule } from '../../material/material.module';
import { AppService } from '../../utils/app.service';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';

describe('CollectFeeComponent', () => {
  let component: CollectFeeComponent;
  let fixture: ComponentFixture<CollectFeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectFeeComponent, ProgressComponent],
      imports: [CommonModule, FormsModule, MaterialModule],
      providers: [
        {
          provide: AppService,
          useValue: {
            validiateMenu: () => of({}),
            getPaymentModes: () => of({ Message: 'Success', PaymentModeList: [] })
          }
        },
        { provide: ToastrService, useValue: { warning: () => {}, error: () => {}, info: () => {}, success: () => {} } },
        {
          provide: LoadDataService,
          useValue: { validiateMenu: () => ({ ResponseReceived: true }) }
        },
        {
          provide: LocalService,
          useValue: {
            getEmployeeDetail: () => ({}),
            encrypt: (value: string) => ({ toString: () => value })
          }
        },
        { provide: Router, useValue: { url: '/admin/collect-fee' } }
      ]
    });
    fixture = TestBed.createComponent(CollectFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
