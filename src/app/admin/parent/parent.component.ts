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
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {
  dataLoading = false;
  ParentList: any[] = [];
  ClassList: any[] = [];
  Parent: any = {};
  Filter: any = {};
  searchText = '';
  StudentList: any[] = [];
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
    this.getClassList();
    this.getParentList();
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

  @ViewChild('formParent') formParent: NgForm;

  resetForm() {
    this.Parent = { Status: true };
    this.StudentList = [];
    this.searchText = '';
    if (this.formParent) {
      this.formParent.control.markAsPristine();
      this.formParent.control.markAsUntouched();
    }
    this.isSubmitted = false;
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

  getParentList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getParentList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ParentList = response.ParentList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching records');
      this.dataLoading = false;
    });
  }

  searchStudent() {
    if (!this.searchText || this.searchText.trim().length < 2) {
      this.toastr.warning('Enter at least 2 characters');
      return;
    }
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ SearchText: this.searchText.trim() })).toString()
    };
    this.service.searchStudentForFee(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentList = response.StudentList || [];
        if (this.StudentList.length === 0) this.toastr.info('No student found');
      }
    });
  }

  selectStudent(stu: any) {
    this.Parent.StudentId = stu.StudentId;
    this.searchText = stu.AdmissionNo + ' - ' + stu.StudentName;
    this.StudentList = [];
  }

  saveParent() {
    this.isSubmitted = true;
    this.formParent.control.markAllAsTouched();
    if (this.formParent.invalid || !this.Parent.StudentId) {
      this.toastr.error('Select student and fill required fields');
      return;
    }

    this.Parent.CreatedBy = this.staffLogin.StaffLoginId;
    this.Parent.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Parent)).toString()
    };

    this.service.saveParent(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(this.Parent.ParentId > 0 ? 'Parent updated' : 'Parent saved');
        $('#staticBackdrop').modal('hide');
        this.resetForm();
        this.getParentList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error while saving');
    });
  }

  editParent(item: any) {
    this.resetForm();
    this.Parent = { ...item };
    this.searchText = item.AdmissionNo + ' - ' + item.StudentName;
  }

  deleteParent(item: any) {
    if (!confirm('Delete parent details for ' + item.StudentName + '?')) return;
    const request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(item)).toString()
    };
    this.service.deleteParent(request).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success('Deleted successfully');
        this.getParentList();
      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  clearFilter() {
    this.Filter = {};
    this.getParentList();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}