import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { Month } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monthly-collection-report',
  templateUrl: './monthly-collection-report.component.html',
  styleUrls: ['./monthly-collection-report.component.css']
})
export class MonthlyCollectionReportComponent {
  dataLoading = false;
  MonthlyList: any[] = [];
  ClassWiseList: any[] = [];
  Filter: any = {};
  GrandTotal = 0;
  TotalReceipts = 0;

  MonthList = this.loadData.GetEnumList(Month);
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
    this.Filter = {
      YearNo: new Date().getFullYear(),
      MonthNo: null
    };
    this.loadReport();
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

  loadReport() {
    if (!this.Filter.YearNo) {
      this.toastr.error('Select Year');
      return;
    }
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Filter)).toString()
    };
    this.dataLoading = true;
    this.service.getMonthlyCollectionReport(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.MonthlyList = response.MonthlyList || [];
        this.ClassWiseList = response.ClassWiseList || [];
        this.GrandTotal = response.GrandTotal || 0;
        this.TotalReceipts = response.TotalReceipts || 0;
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading report');
      this.dataLoading = false;
    });
  }

  getMonthName(m: number): string {
    const item = this.MonthList.find((x: any) => x.Key == m);
    return item ? item.Value : '';
  }

  yearOptions(): number[] {
    const y = new Date().getFullYear();
    return [y, y - 1, y - 2, y - 3];
  }
}