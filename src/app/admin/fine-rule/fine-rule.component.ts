import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fine-rule',
  templateUrl: './fine-rule.component.html',
  styleUrls: ['./fine-rule.component.css']
})
export class FineRuleComponent {
  dataLoading = false;
  FineRuleList: any[] = [];
  AcademicYearList: any[] = [];
  FineRule: any = {};
  isSubmitted = false;

  FineTypeList = [
    { Key: 'Fixed', Value: 'Fixed Amount' },
    { Key: 'PerDay', Value: 'Per Day' },
    { Key: 'Percentage', Value: 'Percentage of Fee' }
  ];

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
    this.getAcademicYearList();
    this.getFineRuleList();
    this.resetForm();
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

  @ViewChild('formFineRule') formFineRule: NgForm;

  resetForm() {
    this.FineRule = {
      Status: true,
      FineType: 'PerDay',
      GraceDays: 0,
      FineAmount: 0
    };
    if (this.formFineRule) {
      this.formFineRule.control.markAsPristine();
      this.formFineRule.control.markAsUntouched();
    }
    this.isSubmitted = false;
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

  getFineRuleList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getFineRuleList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.FineRuleList = response.FineRuleList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveFineRule() {
    this.isSubmitted = true;
    this.formFineRule.control.markAllAsTouched();
    if (this.formFineRule.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.FineRule.CreatedBy = this.staffLogin.StaffLoginId;
    this.FineRule.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FineRule)).toString()
    };

    this.service.saveFineRule(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(this.FineRule.FineRuleId > 0 ? 'Updated' : 'Saved');
        $('#staticBackdrop').modal('hide');
        this.resetForm();
        this.getFineRuleList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error while saving');
    });
  }

  editFineRule(item: any) {
    this.resetForm();
    this.FineRule = { ...item };
  }

  deleteFineRule(item: any) {
    if (!confirm('Delete rule "' + item.RuleName + '"?')) return;
    const request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(item)).toString()
    };
    this.service.deleteFineRule(request).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success('Deleted');
        this.getFineRuleList();
      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  getFineTypeName(key: string): string {
    const item = this.FineTypeList.find(x => x.Key == key);
    return item ? item.Value : key;
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}