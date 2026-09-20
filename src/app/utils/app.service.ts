import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from './constant-data';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly apiUrl: string = ConstantData.getApiUrl();
  private readonly baseUrl: string = ConstantData.getBaseUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient) {
  }

  getImageUrl(): string {
    return ConstantData.getBaseUrl();
  }
  // Academic Year
  getAcademicYearList(obj: any) {
    return this.http.post(this.apiUrl + "AcademicYear/AcademicYearList", obj, { headers: this.headers })
  }

  saveAcademicYear(obj: any) {
    return this.http.post(this.apiUrl + "AcademicYear/saveAcademicYear", obj, { headers: this.headers })
  }

  deleteAcademicYear(obj: any) {
    return this.http.post(this.apiUrl + "AcademicYear/deleteAcademicYear", obj, { headers: this.headers })
  }

    // Class Master
  getClassMasterList(obj: any) {
    return this.http.post(this.apiUrl + "ClassMaster/ClassMasterList", obj, { headers: this.headers })
  }

  saveClassMaster(obj: any) {
    return this.http.post(this.apiUrl + "ClassMaster/saveClassMaster", obj, { headers: this.headers })
  }

  deleteClassMaster(obj: any) {
    return this.http.post(this.apiUrl + "ClassMaster/deleteClassMaster", obj, { headers: this.headers })
  }
    // Section Master
  getSectionMasterList(obj: any) {
    return this.http.post(this.apiUrl + "SectionMaster/SectionMasterList", obj, { headers: this.headers })
  }

  saveSectionMaster(obj: any) {
    return this.http.post(this.apiUrl + "SectionMaster/saveSectionMaster", obj, { headers: this.headers })
  }

  deleteSectionMaster(obj: any) {
    return this.http.post(this.apiUrl + "SectionMaster/deleteSectionMaster", obj, { headers: this.headers })
  }
    // Student
  getStudentList(obj: any) {
    return this.http.post(this.apiUrl + "Student/StudentList", obj, { headers: this.headers })
  }

  saveStudent(obj: any) {
    return this.http.post(this.apiUrl + "Student/saveStudent", obj, { headers: this.headers })
  }

  deleteStudent(obj: any) {
    return this.http.post(this.apiUrl + "Student/deleteStudent", obj, { headers: this.headers })
  }

  // Fee Head
  getFeeHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeHead/FeeHeadList", obj, { headers: this.headers })
  }

  saveFeeHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeHead/saveFeeHead", obj, { headers: this.headers })
  }

  deleteFeeHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeHead/deleteFeeHead", obj, { headers: this.headers })
  }


    // Fee Structure
  getFeeStructureList(obj: any) {
    return this.http.post(this.apiUrl + "FeeStructure/FeeStructureList", obj, { headers: this.headers })
  }

  saveFeeStructure(obj: any) {
    return this.http.post(this.apiUrl + "FeeStructure/saveFeeStructure", obj, { headers: this.headers })
  }

  deleteFeeStructure(obj: any) {
    return this.http.post(this.apiUrl + "FeeStructure/deleteFeeStructure", obj, { headers: this.headers })
  }

    // Fee Payment / Collect Fee
  searchStudentForFee(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/SearchStudent", obj, { headers: this.headers })
  }

  getPendingFees(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/GetPendingFees", obj, { headers: this.headers })
  }

  getPaymentModes(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/GetPaymentModes", obj, { headers: this.headers })
  }

  saveFeePayment(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/SaveFeePayment", obj, { headers: this.headers })
  }


  // Fee Installment
  generateInstallments(obj: any) {
    return this.http.post(this.apiUrl + "FeeInstallment/GenerateInstallments", obj, { headers: this.headers })
  }

  getInstallmentList(obj: any) {
    return this.http.post(this.apiUrl + "FeeInstallment/InstallmentList", obj, { headers: this.headers })
  }


    // Fee Receipt
  getFeeReceiptList(obj: any) {
    return this.http.post(this.apiUrl + "FeeReceipt/FeeReceiptList", obj, { headers: this.headers })
  }

  getReceipt(obj: any) {
    return this.http.post(this.apiUrl + "FeeReceipt/GetReceipt", obj, { headers: this.headers })
  }
  // Fee Reports
  getPendingFeeReport(obj: any) {
    return this.http.post(this.apiUrl + "FeeReport/PendingFeeReport", obj, { headers: this.headers })
  }

  getDailyCollectionReport(obj: any) {
    return this.http.post(this.apiUrl + "FeeReport/DailyCollectionReport", obj, { headers: this.headers })
  }




getStudentLedger(obj: any) {
  return this.http.post(this.apiUrl + "FeeReport/StudentLedger", obj, { headers: this.headers })
}





  getParentList(obj: any) {
    return this.http.post(this.apiUrl + "Parent/ParentList", obj, { headers: this.headers })
  }

  getParentByStudent(obj: any) {
    return this.http.post(this.apiUrl + "Parent/GetParentByStudent", obj, { headers: this.headers })
  }

  saveParent(obj: any) {
    return this.http.post(this.apiUrl + "Parent/saveParent", obj, { headers: this.headers })
  }

  deleteParent(obj: any) {
    return this.http.post(this.apiUrl + "Parent/deleteParent", obj, { headers: this.headers })
  }






  getSmsTemplateList(obj: any) {
    return this.http.post(this.apiUrl + "SmsTemplate/SmsTemplateList", obj, { headers: this.headers })
  }

  saveSmsTemplate(obj: any) {
    return this.http.post(this.apiUrl + "SmsTemplate/saveSmsTemplate", obj, { headers: this.headers })
  }

  deleteSmsTemplate(obj: any) {
    return this.http.post(this.apiUrl + "SmsTemplate/deleteSmsTemplate", obj, { headers: this.headers })
  }

  




  getPendingForSms(obj: any) {
    return this.http.post(this.apiUrl + "Sms/GetPendingForSms", obj, { headers: this.headers })
  }

  queueFeeReminder(obj: any) {
    return this.http.post(this.apiUrl + "Sms/QueueFeeReminder", obj, { headers: this.headers })
  }

  getSmsLogList(obj: any) {
    return this.http.post(this.apiUrl + "Sms/SmsLogList", obj, { headers: this.headers })
  }

getMonthlyCollectionReport(obj: any) {
  return this.http.post(this.apiUrl + "FeeReport/MonthlyCollectionReport", obj, { headers: this.headers })
}



  sendPendingSms(obj: any) {
    return this.http.post(this.apiUrl + "Sms/SendPendingSms", obj, { headers: this.headers })
  }






  getPaymentModeList(obj: any) {
    return this.http.post(this.apiUrl + "PaymentMode/PaymentModeList", obj, { headers: this.headers })
  }

  savePaymentMode(obj: any) {
    return this.http.post(this.apiUrl + "PaymentMode/savePaymentMode", obj, { headers: this.headers })
  }

  deletePaymentMode(obj: any) {
    return this.http.post(this.apiUrl + "PaymentMode/deletePaymentMode", obj, { headers: this.headers })
  }


  getStudentAddressList(obj: any) {
    return this.http.post(this.apiUrl + "StudentAddress/StudentAddressList", obj, { headers: this.headers })
  }

  saveStudentAddress(obj: any) {
    return this.http.post(this.apiUrl + "StudentAddress/saveStudentAddress", obj, { headers: this.headers })
  }

  deleteStudentAddress(obj: any) {
    return this.http.post(this.apiUrl + "StudentAddress/deleteStudentAddress", obj, { headers: this.headers })
  }


getFeeDashboard(obj: any) {
  return this.http.post(this.apiUrl + "FeeReport/FeeDashboard", obj, { headers: this.headers })
}



  getFineRuleList(obj: any) {
    return this.http.post(this.apiUrl + "FineRule/FineRuleList", obj, { headers: this.headers })
  }

  saveFineRule(obj: any) {
    return this.http.post(this.apiUrl + "FineRule/saveFineRule", obj, { headers: this.headers })
  }

  deleteFineRule(obj: any) {
    return this.http.post(this.apiUrl + "FineRule/deleteFineRule", obj, { headers: this.headers })
  }

  // District
  getDistrictList(obj: any) {
    return this.http.post(this.apiUrl + "District/DistrictList", obj, { headers: this.headers })
  }

  saveDistrict(obj: any) {
    return this.http.post(this.apiUrl + "District/saveDistrict", obj, { headers: this.headers })
  }

  deleteDistrict(obj: any) {
    return this.http.post(this.apiUrl + "District/deleteDistrict", obj, { headers: this.headers })
  }
  // Session Master
  getSessionMasterList(obj: any) {
    return this.http.post(this.apiUrl + "SessionMaster/SessionMasterList", obj, { headers: this.headers })
  }

  saveSessionMaster(obj: any) {
    return this.http.post(this.apiUrl + "SessionMaster/saveSessionMaster", obj, { headers: this.headers })
  }

  deleteSessionMaster(obj: any) {
    return this.http.post(this.apiUrl + "SessionMaster/deleteSessionMaster", obj, { headers: this.headers })
  }
  // Company
  getCompanyList(obj: any) {
    return this.http.post(this.apiUrl + "Company/CompanyList", obj, { headers: this.headers })
  }

  saveCompany(obj: any) {
    return this.http.post(this.apiUrl + "Company/saveCompany", obj, { headers: this.headers })
  }

  deleteCompany(obj: any) {
    return this.http.post(this.apiUrl + "Company/deleteCompany", obj, { headers: this.headers })
  }

  // Designation 
  getDesignationList(obj: any) {
    return this.http.post(this.apiUrl + "Designation/DesignationList", obj, { headers: this.headers })
  }

  saveDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/saveDesignation", obj, { headers: this.headers })
  }

  deleteDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/deleteDesignation", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Department
  getDepartmentList(obj: any) {
    return this.http.post(this.apiUrl + "Department/DepartmentList", obj, { headers: this.headers })
  }

  saveDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/saveDepartment", obj, { headers: this.headers })
  }

  deleteDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/deleteDepartment", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff
  getStaffList(obj: any) {
    return this.http.post(this.apiUrl + "Staff/StaffList", obj, { headers: this.headers })
  }

  saveStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/saveStaff", obj, { headers: this.headers })
  }

  deleteStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/deleteStaff", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff Login
  StaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLogin", obj, { headers: this.headers })
  }

  getStaffLoginList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLoginList", obj, { headers: this.headers })
  }

  saveStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/saveStaffLogin", obj, { headers: this.headers })
  }

  deleteStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/deleteStaffLogin", obj, { headers: this.headers })
  }

  changePassword(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/changePassword", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //PageGroup
  getPageGroupList(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/PageGroupList", obj, { headers: this.headers })
  }

  savePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/savePageGroup", obj, { headers: this.headers })
  }

  deletePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/deletePageGroup", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Page
  getPageList(obj: any) {
    return this.http.post(this.apiUrl + "Page/PageList", obj, { headers: this.headers })
  }

  savePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/savePage", obj, { headers: this.headers })
  }

  deletePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/deletePage", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Menu
  getUserMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/UserMenuList", obj, { headers: this.headers })
  }

  validiateMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/ValidiateMenu", obj, { headers: this.headers })
  }

  getMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuList", obj, { headers: this.headers })
  }

  saveMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/saveMenu", obj, { headers: this.headers })
  }

  deleteMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/deleteMenu", obj, { headers: this.headers })
  }

  menuUp(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuUp", obj, { headers: this.headers })
  }

  menuDown(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuDown", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Role
  getRoleList(obj: any) {
    return this.http.post(this.apiUrl + "Role/RoleList", obj, { headers: this.headers })
  }

  saveRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/saveRole", obj, { headers: this.headers })
  }

  deleteRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/deleteRole", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //RoleMenu
  getRoleMenuList(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/AllRoleMenuList", obj, { headers: this.headers })
  }

  saveRoleMenu(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/saveRoleMenu", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //StaffLoginRole
  getStaffLoginRoleList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/StaffLoginRoleList", obj, { headers: this.headers })
  }

  saveStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/saveStaffLoginRole", obj, { headers: this.headers })
  }

  deleteStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/deleteStaffLoginRole", obj, { headers: this.headers })
  }

  //State
  getStateList(obj: any) {
    return this.http.post(this.apiUrl + "State/StateList", obj, { headers: this.headers })
  }

  saveState(obj: any) {
    return this.http.post(this.apiUrl + "State/saveState", obj, { headers: this.headers })
  }

  deleteState(obj: any) {
    return this.http.post(this.apiUrl + "State/deleteState", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //City
  getCityList(obj: any) {
    return this.http.post(this.apiUrl + "City/CityList", obj, { headers: this.headers })
  }

  saveCity(obj: any) {
    return this.http.post(this.apiUrl + "City/saveCity", obj, { headers: this.headers })
  }

  deleteCity(obj: any) {
    return this.http.post(this.apiUrl + "City/deleteCity", obj, { headers: this.headers })
  }
}
