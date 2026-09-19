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
  selector: 'app-student-address',
  templateUrl: './student-address.component.html',
  styleUrls: ['./student-address.component.css']
})
export class StudentAddressComponent {
  dataLoading = false;
  StudentAddressList: any[] = [];
  ClassList: any[] = [];
  StateList: any[] = [];
  CityList: any[] = [];
  AllCityList: any[] = [];
  StudentAddress: any = {};
  Filter: any = {};
  searchText = '';
  StudentList: any[] = [];
  isSubmitted = false;
  sameAsPresent = false;

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
    this.getStateList();
    this.getCityList();
    this.getStudentAddressList();
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

  @ViewChild('formAddress') formAddress: NgForm;

  resetForm() {
    this.StudentAddress = { Status: true };
    this.searchText = '';
    this.StudentList = [];
    this.sameAsPresent = false;
    this.CityList = this.AllCityList;
    if (this.formAddress) {
      this.formAddress.control.markAsPristine();
      this.formAddress.control.markAsUntouched();
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

  getStateList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getStateList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.StateList = response.StateList || response.States || [];
      }
    });
  }

  getCityList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.service.getCityList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllCityList = response.CityList || response.Cities || [];
        this.CityList = this.AllCityList;
      }
    });
  }

  onStateChange() {
    if (this.StudentAddress.StateId) {
      this.CityList = this.AllCityList.filter(x => x.StateId == this.StudentAddress.StateId);
    } else {
      this.CityList = this.AllCityList;
    }
    this.StudentAddress.CityId = null;
  }

  getStudentAddressList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter || {})).toString()
    };
    this.dataLoading = true;
    this.service.getStudentAddressList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.StudentAddressList = response.StudentAddressList || [];
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
    this.StudentAddress.StudentId = stu.StudentId;
    this.searchText = stu.AdmissionNo + ' - ' + stu.StudentName;
    this.StudentList = [];
  }

  copyPresentAddress() {
    if (this.sameAsPresent) {
      this.StudentAddress.PermanentAddress = this.StudentAddress.PresentAddress;
    }
  }

  saveStudentAddress() {
    this.isSubmitted = true;
    this.formAddress.control.markAllAsTouched();
    if (this.formAddress.invalid || !this.StudentAddress.StudentId) {
      this.toastr.error('Select student and fill required fields');
      return;
    }

    this.StudentAddress.CreatedBy = this.staffLogin.StaffLoginId;
    this.StudentAddress.UpdatedBy = this.staffLogin.StaffLoginId;

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.StudentAddress)).toString()
    };

    this.service.saveStudentAddress(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(
          this.StudentAddress.StudentAddressId > 0 ? 'Address updated' : 'Address saved'
        );
        $('#staticBackdrop').modal('hide');
        this.resetForm();
        this.getStudentAddressList();
      } else {
        this.toastr.error(response.Message);
      }
    }, () => {
      this.toastr.error('Error while saving');
    });
  }

  editStudentAddress(item: any) {
    this.resetForm();
    this.StudentAddress = { ...item };
    this.searchText = item.AdmissionNo + ' - ' + item.StudentName;
    if (item.StateId) {
      this.CityList = this.AllCityList.filter(x => x.StateId == item.StateId);
    }
  }

  deleteStudentAddress(item: any) {
    if (!confirm('Delete address for ' + item.StudentName + '?')) return;
    const request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(item)).toString()
    };
    this.service.deleteStudentAddress(request).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success('Deleted successfully');
        this.getStudentAddressList();
      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  clearFilter() {
    this.Filter = {};
    this.getStudentAddressList();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
}