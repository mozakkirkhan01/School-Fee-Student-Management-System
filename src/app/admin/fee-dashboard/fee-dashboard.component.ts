import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-dashboard',
  templateUrl: './fee-dashboard.component.html',
  styleUrls: ['./fee-dashboard.component.css']
})
export class FeeDashboardComponent {
  dataLoading = false;
  TotalStudents = 0;
  TodayCollection = 0;
  TodayReceipts = 0;
  MonthCollection = 0;
  TotalPending = 0;
  PendingStudents = 0;
  RecentReceipts: any[] = [];
  ClassPending: any[] = [];

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
    this.loadDashboard();
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

  loadDashboard() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getFeeDashboard(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TotalStudents = response.TotalStudents || 0;
        this.TodayCollection = response.TodayCollection || 0;
        this.TodayReceipts = response.TodayReceipts || 0;
        this.MonthCollection = response.MonthCollection || 0;
        this.TotalPending = response.TotalPending || 0;
        this.PendingStudents = response.PendingStudents || 0;
        this.RecentReceipts = response.RecentReceipts || [];
        this.ClassPending = response.ClassPending || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading dashboard');
      this.dataLoading = false;
    });
  }
}