import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { FeeType, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fee-head',
  templateUrl: './fee-head.component.html',
  styleUrls: ['./fee-head.component.css']
})
export class FeeHeadComponent {
  dataLoading = false;
  FeeHeadList: any[] = [];
  FeeHead: any = {};
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

  FeeTypeList =this.loadData.GetEnumList(FeeType);
  AllFeeTypeList = FeeType;

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
    this.getFeeHeadList();
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

  @ViewChild('formFeeHead') formFeeHead: NgForm;

  resetForm() {
    this.FeeHead = {
      Status: true,
      IsMonthly: false,
      IsRefundable: false,
      FeeType: 'OneTime'
    };
    if (this.formFeeHead) {
      this.formFeeHead.control.markAsPristine();
      this.formFeeHead.control.markAsUntouched();
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

  getFeeHeadList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getFeeHeadList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeHeadList = response.FeeHeadList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveFeeHead() {
    this.isSubmitted = true;
    this.formFeeHead.control.markAllAsTouched();
    if (this.formFeeHead.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.FeeHead.CreatedBy = this.staffLogin.StaffLoginId;
    this.FeeHead.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeHead)).toString()
    };

    this.service.saveFeeHead(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.FeeHead.FeeHeadId > 0) {
          this.toastr.success('Fee Head updated successfully');
          $('#staticBackdrop').modal('hide');
        } else {
          this.toastr.success('Fee Head added successfully');
        }
        this.resetForm();
        this.getFeeHeadList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteFeeHead(obj: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      const request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      };
      this.dataLoading = true;
      this.service.deleteFeeHead(request).subscribe(r1 => {
        const response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success('Record deleted successfully');
          this.getFeeHeadList();
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

  editFeeHead(obj: any) {
    this.resetForm();
    this.FeeHead = { ...obj };
  }
}