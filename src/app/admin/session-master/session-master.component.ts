import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-session-master',
  templateUrl: './session-master.component.html',
  styleUrls: ['./session-master.component.css']
})
export class SessionMasterComponent {
  dataLoading = false;
  SessionMasterList: any[] = [];
  AcademicYearList: any[] = [];
  SessionMaster: any = {};
  isSubmitted = false;
  StatusList = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p = 1;
  Search = '';
  reverse = false;
  sortKey = '';
  itemPerPage = this.PageSize[0];
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
    this.getAcademicYearList();
    this.getSessionMasterList();
    this.resetForm();
  }

  validiateMenu() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Url: this.router.url,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    };
    this.dataLoading = true;
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router);
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  @ViewChild('formSessionMaster') formSessionMaster: NgForm;

  resetForm() {
    this.SessionMaster = {
      Status: true
    };
    if (this.formSessionMaster) {
      this.formSessionMaster.control.markAsPristine();
      this.formSessionMaster.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p;
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

  getSessionMasterList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getSessionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionMasterList = response.SessionMasterList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveSessionMaster() {
    this.isSubmitted = true;
    this.formSessionMaster.control.markAllAsTouched();
    if (this.formSessionMaster.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.SessionMaster.CreatedBy = this.staffLogin.StaffLoginId;
    this.SessionMaster.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.SessionMaster)).toString()
    };

    this.service.saveSessionMaster(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.SessionMaster.SessionId > 0) {
          this.toastr.success('Session updated successfully');
          $('#staticBackdrop').modal('hide');
        } else {
          this.toastr.success('Session added successfully');
        }
        this.resetForm();
        this.getSessionMasterList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteSessionMaster(obj: any) {
    if (confirm('Are you sure you want to delete this session?')) {
      const request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      };
      this.dataLoading = true;
      this.service.deleteSessionMaster(request).subscribe(r1 => {
        const response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success('Record deleted successfully');
          this.getSessionMasterList();
        } else {
          this.toastr.error(response.Message);
          this.dataLoading = false;
        }
      }, () => {
        this.toastr.error('Error occured while deleting the record');
        this.dataLoading = false;
      });
    }
  }

editSessionMaster(obj: any) {
  this.resetForm();
  this.SessionMaster = {
    SessionId: obj.SessionId,
    SessionName: obj.SessionName,
    AcademicYearId: obj.AcademicYearId,
    Status: obj.Status
  };
}
}