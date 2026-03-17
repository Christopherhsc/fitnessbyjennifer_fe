import { AfterViewInit, Component, ElementRef, ViewChild, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Language, LanguageService } from '../../../shared/services/language.service';

Chart.register(...registerables);

type ScanSortColumn = 'date' | 'weight' | 'fat' | 'muscle';

interface ScanEntry {
  date: string;
  weight?: number;
  fatPercentage?: number;
  muscleMass?: number;
}

interface ScanningsCopy {
  eyebrow: string;
  title: string;
  intro: string;
  addData: string;
  yourData: string;
  chartTitle: string;
  chartEmpty: string;
  addButton: string;
  date: string;
  datePlaceholder: string;
  weight: string;
  fat: string;
  muscle: string;
  dateAxis: string;
  valueAxis: string;
  weightUnit: string;
  percentUnit: string;
  emptyList: string;
  delete: string;
  invalidDate: string;
  invalidValue: string;
}

const SCANNINGS_COPY: Record<Language, ScanningsCopy> = {
  da: {
    eyebrow: 'Scanninger',
    title: 'Registrer dine målinger og følg udviklingen over tid',
    intro:
      'Tilføj nye scanninger, sammenlign dine værdier og få et roligt visuelt overblik direkte i dashboardet.',
    addData: 'Tilføj måling',
    yourData: 'Dine data',
    chartTitle: 'Udvikling over tid',
    chartEmpty: 'Grafen bliver automatisk opdateret, når du tilføjer din første måling.',
    addButton: 'Tilføj måling',
    date: 'Dato',
    datePlaceholder: 'Vælg dato',
    weight: 'Vægt',
    fat: 'Fedtprocent',
    muscle: 'Muskelmasse',
    dateAxis: 'Dato',
    valueAxis: 'Værdier',
    weightUnit: 'kg',
    percentUnit: '%',
    emptyList: 'Der er endnu ingen målinger at vise.',
    delete: 'Slet',
    invalidDate: 'Indtast en gyldig dato.',
    invalidValue: 'Indtast mindst én gyldig værdi.',
  },
  en: {
    eyebrow: 'Scans',
    title: 'Log your measurements and follow your progress over time',
    intro:
      'Add new scan data, compare your values, and get a calm visual overview directly in the dashboard.',
    addData: 'Add measurement',
    yourData: 'Your data',
    chartTitle: 'Progress over time',
    chartEmpty: 'The chart updates automatically when you add your first measurement.',
    addButton: 'Add measurement',
    date: 'Date',
    datePlaceholder: 'Choose date',
    weight: 'Weight',
    fat: 'Body fat',
    muscle: 'Muscle mass',
    dateAxis: 'Date',
    valueAxis: 'Values',
    weightUnit: 'kg',
    percentUnit: '%',
    emptyList: 'No measurements have been added yet.',
    delete: 'Delete',
    invalidDate: 'Enter a valid date.',
    invalidValue: 'Enter at least one valid value.',
  },
};

@Component({
  selector: 'app-scannings',
  templateUrl: './scannings.component.html',
  styleUrl: './scannings.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ScanningsComponent implements AfterViewInit {
  private readonly languageService = inject(LanguageService);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  sortDirection: 'asc' | 'desc' = 'asc';
  newDate = '';
  weight: number | null = null;
  value2: number | null = null;
  value3: number | null = null;

  data: ScanEntry[] = [];

  readonly content = computed(() => SCANNINGS_COPY[this.languageService.language()]);

  constructor() {
    effect(() => {
      this.content();
      this.syncChartFromData();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (!ctx) {
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: this.content().weight,
            data: [],
            borderColor: this.getCSSVariable('--main-color'),
            backgroundColor: this.getCSSVariable('--main-color'),
            borderWidth: 2,
            tension: 0.32,
            pointRadius: 4,
            pointHoverRadius: 5,
          },
          {
            label: `${this.content().fat} ${this.content().percentUnit}`,
            data: [],
            borderColor: this.getCSSVariable('--text-color'),
            backgroundColor: this.getCSSVariable('--text-color'),
            borderWidth: 2,
            tension: 0.32,
            pointRadius: 4,
            pointHoverRadius: 5,
          },
          {
            label: this.content().muscle,
            data: [],
            borderColor: this.getCSSVariable('--niche-color'),
            backgroundColor: this.getCSSVariable('--niche-color'),
            borderWidth: 2,
            tension: 0.32,
            pointRadius: 4,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const suffix =
                  context.dataset.label?.includes(this.content().percentUnit)
                    ? ` ${this.content().percentUnit}`
                    : ` ${this.content().weightUnit}`;
                return `${context.dataset.label}: ${this.formatValue(context.parsed.y)}${suffix}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: this.content().dateAxis },
            grid: { display: false },
          },
          y: {
            title: { display: true, text: this.content().valueAxis },
            min: 0,
            ticks: {
              callback: (value) => this.formatValue(Number(value)),
            },
          },
        },
      },
    });
  }

  getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  addData(event: Event): void {
    event.preventDefault();

    if (!this.newDate) {
      alert(this.content().invalidDate);
      return;
    }

    const newEntry: ScanEntry = {
      date: this.newDate,
      weight: this.normalizeValue(this.weight),
      fatPercentage: this.normalizeValue(this.value2),
      muscleMass: this.normalizeValue(this.value3),
    };

    if (!newEntry.weight && !newEntry.fatPercentage && !newEntry.muscleMass) {
      alert(this.content().invalidValue);
      return;
    }

    this.data = [...this.data, newEntry];
    this.syncChartFromData();
    this.resetForm();
  }

  sortData(column: ScanSortColumn): void {
    const sorted = [...this.data].sort((a, b) => {
      const aValue = this.getSortValue(a, column);
      const bValue = this.getSortValue(b, column);

      if (aValue === bValue) {
        return 0;
      }

      return this.sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });

    this.data = sorted;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.syncChartFromData();
  }

  deleteData(index: number): void {
    this.data = this.data.filter((_, currentIndex) => currentIndex !== index);
    this.syncChartFromData();
  }

  resetForm(): void {
    this.newDate = '';
    this.weight = null;
    this.value2 = null;
    this.value3 = null;
  }

  formatMetric(value: number | undefined, unit: string): string {
    if (value == null) {
      return '-';
    }

    return `${this.formatValue(value)} ${unit}`;
  }

  private syncChartFromData(): void {
    if (!this.chart) {
      return;
    }

    const scales = this.chart.options.scales as
      | {
          x?: { title?: { display: boolean; text: string } };
          y?: { title?: { display: boolean; text: string } };
        }
      | undefined;

    this.chart.data.labels = this.data.map((item) => item.date);
    this.chart.data.datasets[0].label = this.content().weight;
    this.chart.data.datasets[0].data = this.data.map((item) => item.weight ?? null);
    this.chart.data.datasets[1].label = `${this.content().fat} ${this.content().percentUnit}`;
    this.chart.data.datasets[1].data = this.data.map((item) => item.fatPercentage ?? null);
    this.chart.data.datasets[2].label = this.content().muscle;
    this.chart.data.datasets[2].data = this.data.map((item) => item.muscleMass ?? null);

    if (scales?.x) {
      scales.x.title = {
        display: true,
        text: this.content().dateAxis,
      };
    }

    if (scales?.y) {
      scales.y.title = {
        display: true,
        text: this.content().valueAxis,
      };
    }

    this.chart.update();
  }

  private getSortValue(item: ScanEntry, column: ScanSortColumn): number | string {
    switch (column) {
      case 'date':
        return item.date;
      case 'weight':
        return item.weight ?? -Infinity;
      case 'fat':
        return item.fatPercentage ?? -Infinity;
      case 'muscle':
        return item.muscleMass ?? -Infinity;
    }
  }

  private normalizeValue(value: number | null): number | undefined {
    return value == null || Number.isNaN(value) ? undefined : value;
  }

  private formatValue(value: number): string {
    return new Intl.NumberFormat(this.languageService.language() === 'da' ? 'da-DK' : 'en-GB', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
}
