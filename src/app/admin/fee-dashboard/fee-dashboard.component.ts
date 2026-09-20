import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
import {
  Chart, BarController, BarElement,
  LineController, LineElement, PointElement,
  ArcElement, PieController, DoughnutController,
  CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js';

Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  ArcElement, PieController, DoughnutController,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

type ChartPeriod = '7days' | 'month' | 'year';

@Component({
  selector: 'app-fee-dashboard',
  templateUrl: './fee-dashboard.component.html',
  styleUrls: ['./fee-dashboard.component.css']
})
export class FeeDashboardComponent implements AfterViewInit, OnDestroy {
  dataLoading = false;
  chartLoading = false;

  TotalStudents = 0;
  TodayCollection = 0;
  TodayReceipts = 0;
  MonthCollection = 0;
  TotalPending = 0;
  PendingStudents = 0;
  RecentReceipts: any[] = [];
  ClassPending: any[] = [];

  // ----- Chart filter state -----
  Period: ChartPeriod = '7days';
  SelectedYear: number = new Date().getFullYear();
  SelectedMonth: number = new Date().getMonth() + 1;
  ChartTitle = 'Collection – Last 7 Days';

  Years: number[] = [];
  Months = [
    { value: 1,  name: 'Jan' }, { value: 2,  name: 'Feb' },
    { value: 3,  name: 'Mar' }, { value: 4,  name: 'Apr' },
    { value: 5,  name: 'May' }, { value: 6,  name: 'Jun' },
    { value: 7,  name: 'Jul' }, { value: 8,  name: 'Aug' },
    { value: 9,  name: 'Sep' }, { value: 10, name: 'Oct' },
    { value: 11, name: 'Nov' }, { value: 12, name: 'Dec' }
  ];

  Last7DaysLabels: string[] = [];
  Last7DaysValues: number[] = [];

  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  private collectionChart?: Chart;
  private pendingChart?: Chart;
  private viewReady = false;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();

    // Build last 6 years + current
    const y = new Date().getFullYear();
    for (let i = 0; i < 6; i++) this.Years.push(y - i);

    this.validiateMenu();
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.collectionChart?.destroy();
    this.pendingChart?.destroy();
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

  loadDashboard() {
    const payload = {
      Period: this.Period,
      Year: this.SelectedYear,
      Month: this.SelectedMonth
    };
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };
    this.dataLoading = true;

    this.service.getFeeDashboard(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TotalStudents    = response.TotalStudents || 0;
        this.TodayCollection  = response.TodayCollection || 0;
        this.TodayReceipts    = response.TodayReceipts || 0;
        this.MonthCollection  = response.MonthCollection || 0;
        this.TotalPending     = response.TotalPending || 0;
        this.PendingStudents  = response.PendingStudents || 0;
        this.RecentReceipts   = response.RecentReceipts || [];
        this.ClassPending     = response.ClassPending || [];

        const cd = response.ChartData || [];
        this.Last7DaysLabels = cd.map((x: any) => x.Label || '');
        this.Last7DaysValues = cd.map((x: any) => Number(x.Amount || 0));
        this.ChartTitle = response.ChartTitle || 'Collection';
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
      setTimeout(() => this.renderCharts());
    }, () => {
      this.toastr.error('Error loading dashboard');
      this.dataLoading = false;
    });
  }

  /** User clicked a period preset button */
  setPeriod(p: ChartPeriod) {
    if (this.Period === p && p !== 'month' && p !== 'year') return;
    this.Period = p;
    this.chartLoading = true;
    this.loadDashboardWithChartSpinner();
  }

  /** User changed year or month dropdown */
  onFilterChange() {
    this.chartLoading = true;
    this.loadDashboardWithChartSpinner();
  }

  private loadDashboardWithChartSpinner() {
    // We reuse loadDashboard but stop the KPI flash by keeping dataLoading false
    const payload = {
      Period: this.Period,
      Year: this.SelectedYear,
      Month: this.SelectedMonth
    };
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };

    this.service.getFeeDashboard(obj).subscribe(r1 => {
      const response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TotalStudents    = response.TotalStudents || 0;
        this.TodayCollection  = response.TodayCollection || 0;
        this.TodayReceipts    = response.TodayReceipts || 0;
        this.MonthCollection  = response.MonthCollection || 0;
        this.TotalPending     = response.TotalPending || 0;
        this.PendingStudents  = response.PendingStudents || 0;
        this.RecentReceipts   = response.RecentReceipts || [];
        this.ClassPending     = response.ClassPending || [];

        const cd = response.ChartData || [];
        this.Last7DaysLabels = cd.map((x: any) => x.Label || '');
        this.Last7DaysValues = cd.map((x: any) => Number(x.Amount || 0));
        this.ChartTitle = response.ChartTitle || 'Collection';
      } else {
        this.toastr.error(response.Message);
      }
      this.chartLoading = false;
      setTimeout(() => this.renderCharts());
    }, () => {
      this.toastr.error('Error loading chart');
      this.chartLoading = false;
    });
  }

  private renderCharts() {
    if (!this.viewReady) return;

    // ---------- BAR CHART ----------
    const c1 = document.getElementById('collectionChart') as HTMLCanvasElement;
    if (c1) {
      this.collectionChart?.destroy();

      const ctx = c1.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 320);
      grad.addColorStop(0, 'rgba(79, 124, 255, 0.95)');
      grad.addColorStop(1, 'rgba(79, 124, 255, 0.55)');

      // Adjust bar width based on bucket count
      const bucketCount = this.Last7DaysLabels.length;
      const barThickness =
        bucketCount <= 7  ? 44 :
        bucketCount <= 12 ? 36 :
        bucketCount <= 20 ? 20 : 14;

      this.collectionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.Last7DaysLabels,
          datasets: [{
            label: 'Collection (₹)',
            data: this.Last7DaysValues,
            backgroundColor: grad,
            hoverBackgroundColor: 'rgba(79, 124, 255, 1)',
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: barThickness
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 500, easing: 'easeOutQuart' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1f36',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (c: any) =>
                  ' ₹ ' + Number(c.parsed.y).toLocaleString('en-IN')
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#8894a8',
                font: { size: 11 },
                callback: (v: any) => {
                  const n = Number(v);
                  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
                  if (n >= 1000)   return '₹' + (n / 1000).toFixed(0) + 'K';
                  return '₹' + n;
                }
              },
              grid: { color: '#eef1f6' }
            },
            x: {
              ticks: {
                color: '#5b6478',
                font: { size: 11, weight: 'bold' },
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0
              },
              grid: { display: false }
            }
          }
        }
      });
    }

    // ---------- DOUGHNUT ----------
    const c2 = document.getElementById('pendingChart') as HTMLCanvasElement;
    if (c2) {
      this.pendingChart?.destroy();

      const labels = this.ClassPending.map(x => x.ClassName);
      const data = this.ClassPending.map(x => Number(x.PendingAmount || 0));
      const colors = [
        '#4f7cff', '#16b364', '#f59e0b', '#ef4444',
        '#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6',
        '#f97316', '#6366f1'
      ];

      this.pendingChart = new Chart(c2.getContext('2d')!, {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [{
            data: data.length ? data : [1],
            backgroundColor: data.length ? colors.slice(0, labels.length) : ['#eef1f6'],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, padding: 10, font: { size: 11 }, color: '#5b6478' }
            },
            tooltip: {
              backgroundColor: '#1a1f36',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (c: any) =>
                  ' ' + c.label + ': ₹ ' + Number(c.parsed).toLocaleString('en-IN')
              }
            }
          }
        }
      });
    }
  }
}