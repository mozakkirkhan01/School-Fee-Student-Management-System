import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from "ngx-pagination";
import { MaterialModule } from './material/material.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from './utils/app.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { CityComponent } from './admin/city/city.component';
import { DepartmentComponent } from './admin/department/department.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { MenuComponent } from './admin/menu/menu.component';
import { PageComponent } from './admin/page/page.component';
import { PageGroupComponent } from './admin/page-group/page-group.component';
import { RoleComponent } from './admin/role/role.component';
import { RoleMenuComponent } from './admin/role-menu/role-menu.component';
import { StaffLoginComponent } from './admin/staff-login/staff-login.component';
import { StateComponent } from './admin/state/state.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { ProgressComponent } from './component/progress/progress.component';
import { EnumCasePipe } from './pipes/enum-case.pipe';
import { MoneyPipe } from './pipes/money.pipe';
import { StaffComponent } from './admin/staff/staff.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { CompanyComponent } from './admin/company/company.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AcademicYearComponent } from './admin/academic-year/academic-year.component';
import { ClassMasterComponent } from './admin/class-master/class-master.component';

// ========== PrimeNG Modules ==========
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
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

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminMasterComponent,
    ChangePasswordComponent,
    CityComponent,
    DepartmentComponent,
    DesignationComponent,
    MenuComponent,
    PageComponent,
    PageGroupComponent,
    RoleComponent,
    RoleMenuComponent,
    StaffLoginComponent,
    StateComponent,
    PageNotFoundComponent,
    ProgressComponent,
    EnumCasePipe,
    MoneyPipe,
    StaffComponent,
    OrderByPipe,
    FilterPipe,
    CompanyComponent,
    AcademicYearComponent,
    ClassMasterComponent,
    SectionMasterComponent,
    StudentComponent,
    FeeHeadComponent,
    FeeStructureComponent,
    CollectFeeComponent,
    SessionMasterComponent,
    GenerateInstallmentComponent,
    FeeReceiptComponent,
    PendingFeeReportComponent,
    StudentLedgerComponent,
    ParentComponent,
    SmsTemplateComponent,
    FeeReminderSmsComponent,
    SmsLogComponent,
    MonthlyCollectionReportComponent,
    PaymentModeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    TooltipModule,

    // ========== PrimeNG ==========
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    TagModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    RippleModule
  ],
  providers: [
    AppService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideAnimations(),
    provideToastr(),
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }