import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collect-fee',
  templateUrl: './collect-fee.component.html',
  styleUrls: ['./collect-fee.component.css']
})
export class CollectFeeComponent {
  dataLoading = false;
  searchText = '';
  StudentList: any[] = [];
  selectedStudent: any = null;
  PendingFeeList: any[] = [];
  PaymentModeList: any[] = [];
  selectedIds: number[] = [];

  Payment: any = {
    PaymentModeId: null,
    PaidAmount: 0,
    DiscountAmount: 0,
    FineAmount: 0,
    TransactionReference: '',
    Remarks: ''
  };

  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  lastReceiptNo = '';

  monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.loadPaymentModes();
  }

  validiateMenu() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Url: this.router.url,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    };
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router);
    });
  }

  loadPaymentModes() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getPaymentModes(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PaymentModeList = response.PaymentModeList || [];
      }
    });
  }

  searchStudent() {
    if (!this.searchText || this.searchText.trim().length < 2) {
      this.toastr.warning('Enter at least 2 characters');
      return;
    }
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ SearchText: this.searchText.trim() })).toString()
    };
    this.dataLoading = true;
    this.service.searchStudentForFee(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentList = response.StudentList || [];
        if (this.StudentList.length === 0) {
          this.toastr.info('No student found');
        }
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while searching');
      this.dataLoading = false;
    });
  }

  selectStudent(stu: any) {
    this.selectedStudent = stu;
    this.StudentList = [];
    this.searchText = stu.AdmissionNo + ' - ' + stu.StudentName;
    this.selectedIds = [];
    this.Payment = {
      PaymentModeId: null,
      PaidAmount: 0,
      DiscountAmount: 0,
      FineAmount: 0,
      TransactionReference: '',
      Remarks: ''
    };
    this.loadPendingFees(stu.StudentId);
  }

  loadPendingFees(studentId: number) {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ StudentId: studentId })).toString()
    };
    this.dataLoading = true;
    this.service.getPendingFees(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PendingFeeList = response.PendingFeeList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading pending fees');
      this.dataLoading = false;
    });
  }

  toggleSelect(item: any) {
    const idx = this.selectedIds.indexOf(item.InstallmentId);
    if (idx > -1) {
      this.selectedIds.splice(idx, 1);
    } else {
      this.selectedIds.push(item.InstallmentId);
    }
    this.calculateTotal();
  }

  isSelected(id: number): boolean {
    return this.selectedIds.indexOf(id) > -1;
  }

  selectAll() {
    if (this.selectedIds.length === this.PendingFeeList.length) {
      this.selectedIds = [];
    } else {
      this.selectedIds = this.PendingFeeList.map(x => x.InstallmentId);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    this.PendingFeeList.forEach(item => {
      if (this.selectedIds.indexOf(item.InstallmentId) > -1) {
        total += Number(item.BalanceAmount || 0);
      }
    });
    this.Payment.PaidAmount = total;
  }

  get totalSelected(): number {
    return this.Payment.PaidAmount || 0;
  }

  get netPayable(): number {
    return (Number(this.Payment.PaidAmount) || 0)
      - (Number(this.Payment.DiscountAmount) || 0)
      + (Number(this.Payment.FineAmount) || 0);
  }

  savePayment() {
    if (!this.selectedStudent) {
      this.toastr.error('Select a student first');
      return;
    }
    if (this.selectedIds.length === 0) {
      this.toastr.error('Select at least one fee installment');
      return;
    }
    if (!this.Payment.PaymentModeId) {
      this.toastr.error('Select payment mode');
      return;
    }
    if (this.netPayable <= 0) {
      this.toastr.error('Payable amount must be greater than zero');
      return;
    }

    const payload = {
      StudentId: this.selectedStudent.StudentId,
      SessionId: this.selectedStudent.SessionId,
      PaymentModeId: this.Payment.PaymentModeId,
      PaidAmount: this.netPayable,
      DiscountAmount: this.Payment.DiscountAmount || 0,
      FineAmount: this.Payment.FineAmount || 0,
      TransactionReference: this.Payment.TransactionReference,
      Remarks: this.Payment.Remarks,
      ReceivedBy: this.staffLogin.StaffId || this.staffLogin.StaffLoginId,
      CreatedBy: this.staffLogin.StaffLoginId,
      InstallmentIds: this.selectedIds.join(',')
    };

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };

    this.dataLoading = true;
    this.service.saveFeePayment(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.lastReceiptNo = response.ReceiptNo;
        this.toastr.success('Payment saved. Receipt: ' + response.ReceiptNo);
        this.loadPendingFees(this.selectedStudent.StudentId);
        this.selectedIds = [];
        this.Payment.DiscountAmount = 0;
        this.Payment.FineAmount = 0;
        this.Payment.TransactionReference = '';
        this.Payment.Remarks = '';
        this.Payment.PaidAmount = 0;
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while saving payment');
      this.dataLoading = false;
    });
  }

  clearAll() {
    this.selectedStudent = null;
    this.PendingFeeList = [];
    this.selectedIds = [];
    this.searchText = '';
    this.StudentList = [];
    this.lastReceiptNo = '';
    this.Payment = {
      PaymentModeId: null,
      PaidAmount: 0,
      DiscountAmount: 0,
      FineAmount: 0,
      TransactionReference: '',
      Remarks: ''
    };
  }

  getMonthName(m: number): string {
    return this.monthNames[m] || '';
  }
}