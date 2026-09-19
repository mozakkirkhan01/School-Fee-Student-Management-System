import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { Month } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-ledger',
  templateUrl: './student-ledger.component.html',
  styleUrls: ['./student-ledger.component.css']
})
export class StudentLedgerComponent {
  dataLoading = false;
  searchText = '';
  StudentList: any[] = [];
  selectedStudent: any = null;
  InstallmentList: any[] = [];
  ReceiptList: any[] = [];
  TotalNet = 0;
  TotalPaid = 0;
  TotalBalance = 0;

  MonthList = this.loadData.GetEnumList(Month);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

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
        if (this.StudentList.length === 0) this.toastr.info('No student found');
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
    this.loadLedger(stu.StudentId);
  }

  loadLedger(studentId: number) {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ StudentId: studentId })).toString()
    };
    this.dataLoading = true;
    this.service.getStudentLedger(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (response.Student) this.selectedStudent = { ...this.selectedStudent, ...response.Student };
        this.InstallmentList = response.InstallmentList || [];
        this.ReceiptList = response.ReceiptList || [];
        this.TotalNet = response.TotalNet || 0;
        this.TotalPaid = response.TotalPaid || 0;
        this.TotalBalance = response.TotalBalance || 0;
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading ledger');
      this.dataLoading = false;
    });
  }

  clearAll() {
    this.selectedStudent = null;
    this.StudentList = [];
    this.InstallmentList = [];
    this.ReceiptList = [];
    this.searchText = '';
    this.TotalNet = 0;
    this.TotalPaid = 0;
    this.TotalBalance = 0;
  }

  getMonthName(m: number): string {
    if (!m) return 'One Time';
    const item = this.MonthList.find((x: any) => x.Key == m);
    return item ? item.Value : '';
  }
}