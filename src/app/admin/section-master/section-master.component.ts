import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-section-master',
  templateUrl: './section-master.component.html',
  styleUrls: ['./section-master.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class SectionMasterComponent {

  dataLoading = false;
  SectionMasterList: any[] = [];
  ClassList: any[] = [];
  SectionMaster: any = {};
  isSubmitted = false;
  displayDialog = false;

  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSectionMasterList();
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

  @ViewChild('formSectionMaster') formSectionMaster: NgForm;

  getClassList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getClassMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = (response.ClassMasterList || []).filter((x: any) => x.Status == true);
      }
    });
  }

  openNew() {
    this.SectionMaster = { Status: true };
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  editSectionMaster(item: any) {
    this.SectionMaster = { ...item };
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.isSubmitted = false;
  }

  getSectionMasterList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getSectionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SectionMasterList = response.SectionMasterList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveSectionMaster() {
    this.isSubmitted = true;
    if (this.formSectionMaster.invalid) {
      this.toastr.error('Fill all the required fields');
      return;
    }

    this.SectionMaster.CreatedBy = this.staffLogin.StaffLoginId;
    this.SectionMaster.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.SectionMaster)).toString()
    };

    this.service.saveSectionMaster(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.SectionMaster.SectionId > 0
            ? 'Section updated successfully'
            : 'Section added successfully'
        );
        this.hideDialog();
        this.getSectionMasterList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteSectionMaster(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this section?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const request: RequestModel = {
          request: this.localService.encrypt(JSON.stringify(item)).toString()
        };
        this.dataLoading = true;
        this.service.deleteSectionMaster(request).subscribe(r1 => {
          const response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Record deleted successfully');
            this.getSectionMasterList();
          } else {
            this.toastr.error(response.Message);
            this.dataLoading = false;
          }
        }, () => {
          this.toastr.error('Error occured while deleting the record');
          this.dataLoading = false;
        });
      }
    });
  }
}