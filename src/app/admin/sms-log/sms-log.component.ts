import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sms-log',
  templateUrl: './sms-log.component.html',
  styleUrls: ['./sms-log.component.css']
})
export class SmsLogComponent {
  dataLoading = false;
  SmsLogList: any[] = [];
  Filter: any = {};

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
    const today = new Date();
    this.Filter = {
      FromDate: new Date(today.getFullYear(), today.getMonth(), 1),
      ToDate: today
    };
    this.loadList();
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

  loadList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getSmsLogList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SmsLogList = response.SmsLogList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading SMS log');
      this.dataLoading = false;
    });
  }

  clearFilter() {
    const today = new Date();
    this.Filter = {
      FromDate: new Date(today.getFullYear(), today.getMonth(), 1),
      ToDate: today
    };
    this.loadList();
  }

  setToday() {
    const today = new Date();
    this.Filter.FromDate = today;
    this.Filter.ToDate = today;
    this.loadList();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary';
    const s = status.toLowerCase();
    if (s === 'sent' || s === 'success') return 'bg-success';
    if (s === 'queued' || s === 'pending') return 'bg-warning text-dark';
    if (s === 'failed' || s === 'error') return 'bg-danger';
    return 'bg-secondary';
  }
}