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
  selector: 'app-pending-fee-report',
  templateUrl: './pending-fee-report.component.html',
  styleUrls: ['./pending-fee-report.component.css']
})
export class PendingFeeReportComponent {
  dataLoading = false;
  PendingSummary: any[] = [];
  PendingFeeList: any[] = [];
  ClassList: any[] = [];
  SectionList: any[] = [];
  AllSectionList: any[] = [];
  Filter: any = {};
  TotalPendingAmount = 0;
  TotalStudents = 0;
  viewMode: 'summary' | 'detail' = 'summary';

  MonthList = this.loadData.GetEnumList(Month);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
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
    this.getClassList();
    this.getSectionList();
    this.Filter = { AsOnDate: new Date() };
    this.loadReport();
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

  getSectionList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getSectionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = (response.SectionMasterList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
        this.SectionList = this.AllSectionList;
      }
    });
  }

  onClassChange() {
    if (this.Filter.ClassId) {
      this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.Filter.ClassId);
    } else {
      this.SectionList = this.AllSectionList;
    }
    this.Filter.SectionId = null;
  }

  loadReport() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getPendingFeeReport(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PendingSummary = response.PendingSummary || [];
        this.PendingFeeList = response.PendingFeeList || [];
        this.TotalPendingAmount = response.TotalPendingAmount || 0;
        this.TotalStudents = response.TotalStudents || 0;
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading report');
      this.dataLoading = false;
    });
  }

  clearFilter() {
    this.Filter = { AsOnDate: new Date() };
    this.SectionList = this.AllSectionList;
    this.loadReport();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  getMonthName(m: number): string {
    if (!m) return 'One Time';
    const item = this.MonthList.find((x: any) => x.Key == m);
    return item ? item.Value : '';
  }

}
