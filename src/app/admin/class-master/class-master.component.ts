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
  selector: 'app-class-master',
  templateUrl: './class-master.component.html',
  styleUrls: ['./class-master.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ClassMasterComponent {

  dataLoading = false;
  ClassMasterList: any[] = [];
  ClassMaster: any = {};
  isSubmitted = false;
  displayDialog = false;
  searchText = '';

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
    this.getClassMasterList();
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

  @ViewChild('formClassMaster') formClassMaster: NgForm;

  openNew() {
    this.ClassMaster = {
      Status: true,
      DisplayOrder: 0
    };
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  editClassMaster(item: any) {
    this.ClassMaster = { ...item };
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.isSubmitted = false;
  }

  getClassMasterList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getClassMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassMasterList = response.ClassMasterList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveClassMaster() {
    this.isSubmitted = true;

    if (this.formClassMaster.invalid) {
      this.toastr.error('Fill all the required fields');
      return;
    }

    this.ClassMaster.CreatedBy = this.staffLogin.StaffLoginId;
    this.ClassMaster.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ClassMaster)).toString()
    };

    this.service.saveClassMaster(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.ClassMaster.ClassId > 0
            ? 'Class updated successfully'
            : 'Class added successfully'
        );
        this.hideDialog();
        this.getClassMasterList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteClassMaster(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this class?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const request: RequestModel = {
          request: this.localService.encrypt(JSON.stringify(item)).toString()
        };
        this.dataLoading = true;
        this.service.deleteClassMaster(request).subscribe(r1 => {
          const response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Record deleted successfully');
            this.getClassMasterList();
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