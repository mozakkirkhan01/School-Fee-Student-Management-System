import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { DepartmentComponent } from './admin/department/department.component';
import { StaffComponent } from './admin/staff/staff.component';
import { StaffLoginComponent } from './admin/staff-login/staff-login.component';
import { PageGroupComponent } from './admin/page-group/page-group.component';
import { PageComponent } from './admin/page/page.component';
import { MenuComponent } from './admin/menu/menu.component';
import { RoleComponent } from './admin/role/role.component';
import { RoleMenuComponent } from './admin/role-menu/role-menu.component';
import { StateComponent } from './admin/state/state.component';
import { CityComponent } from './admin/city/city.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { CompanyComponent } from './admin/company/company.component';
import { AcademicYearComponent } from './admin/academic-year/academic-year.component';
import { ClassMasterComponent } from './admin/class-master/class-master.component';
import { SectionMasterComponent } from './admin/section-master/section-master.component';
import { StudentComponent } from './admin/student/student.component';
import { FeeHeadComponent } from './admin/fee-head/fee-head.component';
import { FeeStructureComponent } from './admin/fee-structure/fee-structure.component';
import { CollectFeeComponent } from './admin/collect-fee/collect-fee.component';
import { SessionMasterComponent } from './admin/session-master/session-master.component';
import { GenerateInstallmentComponent } from './admin/generate-installment/generate-installment.component';
import { FeeReceiptComponent } from './admin/fee-receipt/fee-receipt.component';
import { PendingFeeReportComponent } from './admin/pending-fee-report/pending-fee-report.component';
import { StudentLedgerComponent } from './admin/student-ledger/student-ledger.component';
import { ParentComponent } from './admin/parent/parent.component';
import { SmsTemplateComponent } from './admin/sms-template/sms-template.component';
import { FeeReminderSmsComponent } from './admin/fee-reminder-sms/fee-reminder-sms.component';
import { SmsLogComponent } from './admin/sms-log/sms-log.component';
import { MonthlyCollectionReportComponent } from './admin/monthly-collection-report/monthly-collection-report.component';
import { PaymentModeComponent } from './admin/payment-mode/payment-mode.component';
import { StudentAddressComponent } from './admin/student-address/student-address.component';
import { FeeDashboardComponent } from './admin/fee-dashboard/fee-dashboard.component';
import { FineRuleComponent } from './admin/fine-rule/fine-rule.component';

const routes: Routes = [
  { path: '', redirectTo: "/admin-login", pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin', component: AdminMasterComponent, children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'designation', component: DesignationComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'staffLogin', component: StaffLoginComponent },
      { path: 'page-group', component: PageGroupComponent },
      { path: 'page', component: PageComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'role', component: RoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'role-menu/:id', component: RoleMenuComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'academic', component: AcademicYearComponent},
      { path: 'class', component:ClassMasterComponent},
      { path: 'section', component: SectionMasterComponent},
      { path: 'student', component: StudentComponent},
      { path: 'fee', component: FeeHeadComponent},
      { path: 'fee-structure', component: FeeStructureComponent},
      { path: 'collect-fee', component: CollectFeeComponent},
      { path: 'session-master', component: SessionMasterComponent},
      { path: 'generate-installment', component: GenerateInstallmentComponent},
      { path: 'fee-receipt', component: FeeReceiptComponent},
      { path: 'pending-fee-report', component: PendingFeeReportComponent},
      { path: 'student-ledger', component: StudentLedgerComponent},
      { path: 'parent', component: ParentComponent},
      { path: 'sms-template', component: SmsTemplateComponent},
      { path: 'fee-reminder-sms', component: FeeReminderSmsComponent},
      { path: 'sms-log', component: SmsLogComponent},
      { path: 'monthly-collection-report', component: MonthlyCollectionReportComponent},
      { path: 'payment-mode', component: PaymentModeComponent},
      { path: 'student-address', component: StudentAddressComponent},
      { path: 'fee-dashboard', component: FeeDashboardComponent},
      { path: 'fine-rule', component: FineRuleComponent},

    ]
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
