import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
import { Gender, PaymentStatus, Month } from 'src/app/utils/enum';

@Component({
  selector: 'app-generate-installment',
  templateUrl: './generate-installment.component.html',
  styleUrls: ['./generate-installment.component.css']
})
export class GenerateInstallmentComponent {
  dataLoading = false;
  AcademicYearList: any[] = [];
  ClassList: any[] = [];
  InstallmentList: any[] = [];
  Form: any = {};
  Filter: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  monthList = this.loadData.GetEnumList(Month);

  PageSize = ConstantData.PageSizes;
  p = 1;
  Search = '';
  itemPerPage = this.PageSize[0];

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
    this.getAcademicYearList();
    this.getClassList();
    this.Form = {
      MonthNo: new Date().getMonth() + 1,
      YearNo: new Date().getFullYear()
    };
    this.Filter = {
      MonthNo: new Date().getMonth() + 1,
      YearNo: new Date().getFullYear()
    };
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

  getAcademicYearList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getAcademicYearList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AcademicYearList = (response.AcademicYearList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
      }
    });
  }

  getClassList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getClassMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = (response.ClassMasterList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
      }
    });
  }

  generate() {
    if (!this.Form.AcademicYearId) {
      this.toastr.error('Select Academic Year');
      return;
    }
    if (!confirm('Generate fee installments for selected criteria?')) return;

    this.Form.CreatedBy = this.staffLogin.StaffLoginId;
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Form)).toString()
    };
    this.dataLoading = true;
    this.service.generateInstallments(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          `Generated: ${response.Generated}, Skipped (already exist): ${response.Skipped}`
        );
        this.loadList();
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while generating');
      this.dataLoading = false;
    });
  }

  loadList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getInstallmentList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.InstallmentList = response.InstallmentList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading list');
      this.dataLoading = false;
    });
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  getMonthName(m: number): string {
    if (!m) return 'One Time';
    const item = this.monthList.find(x => x.Key == m);
    return item ? item.Value : '';
  }
}