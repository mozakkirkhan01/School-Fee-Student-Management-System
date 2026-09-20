import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fee-receipt',
  templateUrl: './fee-receipt.component.html',
  styleUrls: ['./fee-receipt.component.css']
})
export class FeeReceiptComponent {
  dataLoading = false;
  FeeReceiptList: any[] = [];
  Filter: any = {};
  Receipt: any = null;
  ReceiptDetails: any[] = [];
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
    const today = new Date();
    this.Filter = {
      FromDate: new Date(today.getFullYear(), today.getMonth(), 1),
      ToDate: today
    };
    this.getFeeReceiptList();
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

  getFeeReceiptList() {
    // loadDateYMD formats using local calendar fields (getFullYear/getMonth/getDate),
    // never converting through UTC — this avoids the timezone bug where
    // JSON.stringify(Date) could shift "today" to the previous day depending on
    // the browser's UTC offset, silently excluding same-day receipts from the filter.
    const payload = {
      FromDate: this.loadData.loadDateYMD(this.Filter.FromDate),
      ToDate: this.loadData.loadDateYMD(this.Filter.ToDate),
      ReceiptNo: this.Filter.ReceiptNo || null
    };
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };
    this.dataLoading = true;
    this.service.getFeeReceiptList(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeReceiptList = response.FeeReceiptList || [];
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error while fetching receipts');
      this.dataLoading = false;
    });
  }

  clearFilter() {
    const today = new Date();
    this.Filter = {
      FromDate: new Date(today.getFullYear(), today.getMonth(), 1),
      ToDate: today,
      ReceiptNo: null
    };
    this.getFeeReceiptList();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  viewReceipt(item: any) {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ ReceiptId: item.ReceiptId })).toString()
    };
    this.dataLoading = true;
    this.service.getReceipt(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Receipt = response.Receipt;
        this.ReceiptDetails = response.ReceiptDetails || [];
        $('#receiptModal').modal('show');
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, () => {
      this.toastr.error('Error loading receipt');
      this.dataLoading = false;
    });
  }

  printReceipt() {
    const printContent = document.getElementById('printArea');
    if (!printContent) return;
    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Fee Receipt</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; font-size: 14px; }
            .receipt-title { text-align: center; margin-bottom: 20px; }
            table { width: 100%; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  }
}