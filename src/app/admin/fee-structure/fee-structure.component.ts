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
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.css']
})
export class FeeStructureComponent {
  dataLoading = false;
  FeeStructureList: any[] = [];
  AcademicYearList: any[] = [];
  ClassList: any[] = [];
  FeeHeadList: any[] = [];
  FeeStructure: any = {};
  Filter: any = {};
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
    this.getClassList();
    this.getFeeHeadList();
    this.getFeeStructureList();
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

  @ViewChild('formFeeStructure') formFeeStructure: NgForm;

  resetForm() {
    this.FeeStructure = {
      Status: Status.Active,
      LateFeeApplicable: true,
      DueDay: 10
    };
    if (this.formFeeStructure) {
      this.formFeeStructure.control.markAsPristine();
      this.formFeeStructure.control.markAsUntouched();
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
        this.AcademicYearList = (response.AcademicYearList || []).filter((x: any) => x.Status == true || x.Status == 1);
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
        this.ClassList = (response.ClassMasterList || []).filter((x: any) => x.Status == true || x.Status == 1);
      }
    });
  }

  getFeeHeadList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getFeeHeadList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeHeadList = (response.FeeHeadList || []).filter((x: any) => x.Status == true || x.Status == 1);
      }
    });
  }

  getFeeStructureList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getFeeStructureList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeStructureList = response.FeeStructureList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveFeeStructure() {
    this.isSubmitted = true;
    this.formFeeStructure.control.markAllAsTouched();
    if (this.formFeeStructure.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.FeeStructure.CreatedBy = this.staffLogin.StaffLoginId;
    this.FeeStructure.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeStructure)).toString()
    };

    this.service.saveFeeStructure(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.FeeStructure.FeeStructureId > 0) {
          this.toastr.success('Fee Structure updated successfully');
          $('#staticBackdrop').modal('hide');
        } else {
          this.toastr.success('Fee Structure added successfully');
        }
        this.resetForm();
        this.getFeeStructureList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteFeeStructure(obj: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      const request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      };
      this.dataLoading = true;
      this.service.deleteFeeStructure(request).subscribe(r1 => {
        const response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success('Record deleted successfully');
          this.getFeeStructureList();
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

editFeeStructure(obj: any) {
  this.resetForm();
  this.FeeStructure = {
    FeeStructureId: obj.FeeStructureId ?? obj.FeeStructureID ?? obj.Id,
    AcademicYearId: obj.AcademicYearId,
    ClassId: obj.ClassId,
    FeeHeadId: obj.FeeHeadId,
    Amount: obj.Amount,
    DueDay: obj.DueDay,
    Status: obj.Status === true ? Status.Active : obj.Status === false ? Status.Inactive : Number(obj.Status),
    LateFeeApplicable: obj.LateFeeApplicable
  };
}

  clearFilter() {
    this.Filter = {};
    this.getFeeStructureList();
  }
}