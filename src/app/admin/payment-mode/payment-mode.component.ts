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
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.css']
})
export class PaymentModeComponent {
  dataLoading = false;
  PaymentModeList: any[] = [];
  PaymentMode: any = {};
  isSubmitted = false;

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
    this.getPaymentModeList();
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

  @ViewChild('formPaymentMode') formPaymentMode: NgForm;

  resetForm() {
    this.PaymentMode = { Status: true };
    if (this.formPaymentMode) {
      this.formPaymentMode.control.markAsPristine();
      this.formPaymentMode.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

  getPaymentModeList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getPaymentModeList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PaymentModeList = response.PaymentModeList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  savePaymentMode() {
    this.isSubmitted = true;
    this.formPaymentMode.control.markAllAsTouched();
    if (this.formPaymentMode.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.PaymentMode.CreatedBy = this.staffLogin.StaffLoginId;
    this.PaymentMode.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.PaymentMode)).toString()
    };

    this.service.savePaymentMode(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.PaymentMode.PaymentModeId > 0 ? 'Updated successfully' : 'Saved successfully'
        );
        $('#staticBackdrop').modal('hide');
        this.resetForm();
        this.getPaymentModeList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error while saving');
    });
  }

  editPaymentMode(item: any) {
    this.resetForm();
    this.PaymentMode = {
      PaymentModeId: item.PaymentModeId,
      PaymentModeName: item.PaymentModeName,
      Status: item.Status
    };
  }

  deletePaymentMode(item: any) {
    if (!confirm('Delete payment mode "' + item.PaymentModeName + '"?')) return;
    const request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(item)).toString()
    };
    this.service.deletePaymentMode(request).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success('Deleted successfully');
        this.getPaymentModeList();
      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}