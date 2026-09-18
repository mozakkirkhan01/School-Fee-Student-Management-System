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
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class StudentComponent {

  dataLoading = false;
  StudentList: any[] = [];
  ClassList: any[] = [];
  SectionList: any[] = [];
  AllSectionList: any[] = [];
  SessionList: any[] = [];
  Student: any = {};
  Filter: any = {};
  isSubmitted = false;
  displayDialog = false;

  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  bloodGroupOptions = [
    { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
    { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' },
    { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }
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
    this.getSectionList();
    this.getStudentList();
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

  @ViewChild('formStudent') formStudent: NgForm;

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

  getSectionList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getSectionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = (response.SectionMasterList || []).filter((x: any) => x.Status == true);
        this.SectionList = this.AllSectionList;
      }
    });
  }

  onClassChange() {
    if (this.Student.ClassId) {
      this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.Student.ClassId);
    } else {
      this.SectionList = this.AllSectionList;
    }
    this.Student.SectionId = null;
  }

  onFilterClassChange() {
    if (this.Filter.ClassId) {
      this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.Filter.ClassId);
    } else {
      this.SectionList = this.AllSectionList;
    }
    this.Filter.SectionId = null;
    this.getStudentList();
  }

  openNew() {
    this.Student = {
      Status: true,
      CompanyId: 1,
      Gender: 'Male'
    };
    this.SectionList = this.AllSectionList;
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  editStudent(item: any) {
    this.Student = { ...item };
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == item.ClassId);
    this.isSubmitted = false;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.isSubmitted = false;
  }

  getStudentList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getStudentList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentList = response.StudentList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  saveStudent() {
    this.isSubmitted = true;
    if (this.formStudent.invalid) {
      this.toastr.error('Fill all the required fields');
      return;
    }

    this.Student.CreatedBy = this.staffLogin.StaffLoginId;
    this.Student.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Student)).toString()
    };

    this.service.saveStudent(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.Student.StudentId > 0
            ? 'Student updated successfully'
            : 'Student added successfully'
        );
        this.hideDialog();
        this.getStudentList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteStudent(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete student "${item.StudentName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const request: RequestModel = {
          request: this.localService.encrypt(JSON.stringify(item)).toString()
        };
        this.dataLoading = true;
        this.service.deleteStudent(request).subscribe(r1 => {
          const response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Student deleted successfully');
            this.getStudentList();
          } else {
            this.toastr.error(response.Message);
            this.dataLoading = false;
          }
        }, () => {
          this.toastr.error('Error occured while deleting');
          this.dataLoading = false;
        });
      }
    });
  }

  clearFilter() {
    this.Filter = {};
    this.SectionList = this.AllSectionList;
    this.getStudentList();
  }
}