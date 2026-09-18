import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { BloodGroup, Gender, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
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

  StatusList = this.loadData.GetEnumList(Status);
  genderOptions = this.loadData.GetEnumList(Gender);
  bloodGroupOptions = this.loadData.GetEnumList(BloodGroup);

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
    this.getClassList();
    this.getSectionList();
    this.getSessionList();
    this.getStudentList();
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

  @ViewChild('formStudent') formStudent: NgForm;

  resetForm() {
    this.Student = {
      Status: Status.Active,
      CompanyId: 1,
      Gender: Gender.Male,
      SessionId: null,
      SectionId: null,
      BloodGroup: null
    };
    this.SectionList = this.AllSectionList;
    if (this.formStudent) {
      this.formStudent.control.markAsPristine();
      this.formStudent.control.markAsUntouched();
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

  getSectionList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getSectionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = (response.SectionMasterList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
        this.SectionList = this.AllSectionList;
      }
    });
  }

  getSessionList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getSessionMasterList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = (response.SessionMasterList || [])
          .filter((x: any) => x.Status == true || x.Status == 1);
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
    this.formStudent.control.markAllAsTouched();
    if (this.formStudent.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.Student.CreatedBy = this.staffLogin.StaffLoginId;
    this.Student.UpdatedBy = this.staffLogin.StaffLoginId;

    // avoid sending 0 for optional FKs
    if (!this.Student.SectionId) this.Student.SectionId = null;
    if (!this.Student.SessionId) this.Student.SessionId = null;
    if (!this.Student.BloodGroup) this.Student.BloodGroup = null;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Student)).toString()
    };

    this.service.saveStudent(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Student.StudentId > 0) {
          this.toastr.success('Student updated successfully');
          $('#staticBackdrop').modal('hide');
        } else {
          this.toastr.success('Student added successfully');
        }
        this.resetForm();
        this.getStudentList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error occured while submitting data');
    });
  }

  deleteStudent(obj: any) {
    if (confirm('Are you sure you want to delete student "' + obj.StudentName + '"?')) {
      const request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
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
        this.toastr.error('Error occured while deleting the record');
        this.dataLoading = false;
      });
    }
  }

  editStudent(obj: any) {
    this.resetForm();
    this.Student = { ...obj };
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == obj.ClassId);
  }

  clearFilter() {
    this.Filter = {};
    this.SectionList = this.AllSectionList;
    this.getStudentList();
  }

  getGenderName(value: any): string {
    const item = this.genderOptions.find((x: any) => x.Key == value);
    return item ? item.Value : '-';
  }

  getBloodGroupName(value: any): string {
    const item = this.bloodGroupOptions.find((x: any) => x.Key == value);
    return item ? item.Value : '-';
  }

  getStatusName(value: any): string {
    const item = this.StatusList.find((x: any) => x.Key == value);
    return item ? item.Value : (value == 1 ? 'Active' : 'Inactive');
  }
}