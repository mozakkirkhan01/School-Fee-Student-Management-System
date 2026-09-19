import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-reminder-sms',
  templateUrl: './fee-reminder-sms.component.html',
  styleUrls: ['./fee-reminder-sms.component.css']
})
export class FeeReminderSmsComponent {
  dataLoading = false;
  PendingSmsList: any[] = [];
  TemplateList: any[] = [];
  ClassList: any[] = [];
  selectedIds: number[] = [];
  Filter: any = {};
  TemplateId: number | null = null;

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
    this.getTemplateList();
    this.loadPending();
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

  getTemplateList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getSmsTemplateList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TemplateList = (response.SmsTemplateList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
      }
    });
  }

  loadPending() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.selectedIds = [];
    this.service.getPendingForSms(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PendingSmsList = response.PendingSmsList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading list');
      this.dataLoading = false;
    });
  }

  toggleSelect(studentId: number) {
    const idx = this.selectedIds.indexOf(studentId);
    if (idx > -1) this.selectedIds.splice(idx, 1);
    else this.selectedIds.push(studentId);
  }

  isSelected(id: number): boolean {
    return this.selectedIds.indexOf(id) > -1;
  }

  selectAll() {
    if (this.selectedIds.length === this.PendingSmsList.length) {
      this.selectedIds = [];
    } else {
      this.selectedIds = this.PendingSmsList.map(x => x.StudentId);
    }
  }

  sendReminder() {
    if (!this.TemplateId) {
      this.toastr.error('Select SMS template');
      return;
    }
    if (this.selectedIds.length === 0) {
      this.toastr.error('Select at least one student');
      return;
    }
    if (!confirm('Queue fee reminder SMS for ' + this.selectedIds.length + ' student(s)?')) return;

    const students = this.PendingSmsList.filter(x => this.selectedIds.indexOf(x.StudentId) > -1);

    const payload = {
      TemplateId: this.TemplateId,
      CreatedBy: this.staffLogin.StaffLoginId,
      Students: students
    };

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };

    this.dataLoading = true;
    this.service.queueFeeReminder(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(response.Queued + ' SMS queued successfully');
        this.selectedIds = [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while queueing SMS');
      this.dataLoading = false;
    });
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}