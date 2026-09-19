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
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent {
  dataLoading = false;
  SmsTemplateList: any[] = [];
  SmsTemplate: any = {};
  isSubmitted = false;
  StatusList = this.loadData.GetEnumList(Status);

  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PageSize = ConstantData.PageSizes;
  p = 1;
  Search = '';
  itemPerPage = this.PageSize[0];

  // placeholders help for school fee SMS
  placeholders = [
    '{StudentName}',
    '{AdmissionNo}',
    '{ClassName}',
    '{Amount}',
    '{DueDate}',
    '{ReceiptNo}',
    '{SchoolName}'
  ];

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
    this.getSmsTemplateList();
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

  @ViewChild('formSmsTemplate') formSmsTemplate: NgForm;

  resetForm() {
    this.SmsTemplate = {
      Status: Status.Active
    };
    if (this.formSmsTemplate) {
      this.formSmsTemplate.control.markAsPristine();
      this.formSmsTemplate.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

  getSmsTemplateList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getSmsTemplateList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SmsTemplateList = response.SmsTemplateList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveSmsTemplate() {
    this.isSubmitted = true;
    this.formSmsTemplate.control.markAllAsTouched();
    if (this.formSmsTemplate.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.SmsTemplate.CreatedBy = this.staffLogin.StaffLoginId;
    this.SmsTemplate.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.SmsTemplate)).toString()
    };

    this.service.saveSmsTemplate(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.SmsTemplate.SmsTemplateId > 0 ? 'Template updated' : 'Template saved'
        );
        $('#staticBackdrop').modal('hide');
        this.resetForm();
        this.getSmsTemplateList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error while saving');
    });
  }

  editSmsTemplate(item: any) {
    this.resetForm();
    this.SmsTemplate = { ...item };
  }

  deleteSmsTemplate(item: any) {
    if (!confirm('Delete template "' + item.TemplateName + '"?')) return;
    const request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(item)).toString()
    };
    this.service.deleteSmsTemplate(request).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success('Deleted successfully');
        this.getSmsTemplateList();
      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  insertPlaceholder(ph: string) {
    this.SmsTemplate.MessageBody = (this.SmsTemplate.MessageBody || '') + ' ' + ph;
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}