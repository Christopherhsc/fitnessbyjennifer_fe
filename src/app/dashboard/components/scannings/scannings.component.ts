import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Language, LanguageService } from '../../../shared/services/language.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ScanEntry, ScanService } from '../../../shared/services/scan.service';

Chart.register(...registerables);

type ScanSortColumn = 'date' | 'weight' | 'fat' | 'muscle';

interface ScanFormValue {
  date: string;
  weight?: number;
  fatPercentage?: number;
  muscleMass?: number;
  visibleInChart: boolean;
}

interface ScanningsCopy {
  eyebrow: string;
  title: string;
  intro: string;
  addData: string;
  editData: string;
  yourData: string;
  chartTitle: string;
  chartEmpty: string;
  addButton: string;
  updateButton: string;
  cancelEdit: string;
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
  loading: string;
  saving: string;
  loadError: string;
  saveError: string;
  deleteError: string;
  invalidDate: string;
  invalidValue: string;
  hideFromChart: string;
  showInChart: string;
  edit: string;
  delete: string;
  deletePrompt: string;
  confirmDelete: string;
  cancelDelete: string;
}

const SCANNINGS_COPY: Record<Language, ScanningsCopy> = {
  da: {
    eyebrow: 'Scanninger',
    title: 'Registrer dine målinger og følg udviklingen over tid',
    intro:
      'Tilføj nye scanninger, sammenlign dine værdier og få et roligt visuelt overblik direkte i dashboardet.',
    addData: 'Tilføj måling',
    editData: 'Ændre måling',
    yourData: 'Dine data',
    chartTitle: 'Udvikling over tid',
    chartEmpty: 'Grafen bliver automatisk opdateret, når du tilføjer dine målinger.',
    addButton: 'Tilføj måling',
    updateButton: 'Ændre måling',
    cancelEdit: 'Annuller',
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
    loading: 'Henter scanninger...',
    saving: 'Gemmer...',
    loadError: 'Kunne ikke hente scanninger.',
    saveError: 'Kunne ikke gemme målingen.',
    deleteError: 'Kunne ikke slette målingen.',
    invalidDate: 'Indtast en gyldig dato.',
    invalidValue: 'Indtast mindst én gyldig værdi.',
    hideFromChart: 'Skjul fra graf',
    showInChart: 'Vis i graf',
    edit: 'Rediger måling',
    delete: 'Slet måling',
    deletePrompt: 'Er du sikker?',
    confirmDelete: 'Ja, slet',
    cancelDelete: 'Annuller',
  },
  en: {
    eyebrow: 'Scans',
    title: 'Log your measurements and follow your progress over time',
    intro:
      'Add new scan data, compare your values, and get a calm visual overview directly in the dashboard.',
    addData: 'Add measurement',
    editData: 'Edit measurement',
    yourData: 'Your data',
    chartTitle: 'Progress over time',
    chartEmpty: 'The chart updates automatically when you add your measurement.',
    addButton: 'Add measurement',
    updateButton: 'Update measurement',
    cancelEdit: 'Cancel',
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
    loading: 'Loading scans...',
    saving: 'Saving...',
    loadError: 'Failed to load scans.',
    saveError: 'Failed to save the measurement.',
    deleteError: 'Failed to delete the measurement.',
    invalidDate: 'Enter a valid date.',
    invalidValue: 'Enter at least one valid value.',
    hideFromChart: 'Hide from chart',
    showInChart: 'Show in chart',
    edit: 'Edit measurement',
    delete: 'Delete measurement',
    deletePrompt: 'Are you sure?',
    confirmDelete: 'Yes, delete',
    cancelDelete: 'Cancel',
  },
};

@Component({
  selector: 'app-scannings',
  templateUrl: './scannings.component.html',
  styleUrl: './scannings.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ScanningsComponent implements OnInit, AfterViewInit {
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly scanService = inject(ScanService);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  sortDirection: 'asc' | 'desc' = 'asc';
  newDate = '';
  weight: number | null = null;
  value2: number | null = null;
  value3: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  editingScanId: string | null = null;
  pendingDeleteScanId: string | null = null;
  private userId: string | null = null;

  data: ScanEntry[] = [];

  readonly content = computed(() => SCANNINGS_COPY[this.languageService.language()]);

  constructor() {
    effect(() => {
      this.content();
      this.syncChartFromData();
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (!user.id) {
        this.userId = null;
        this.data = [];
        this.syncChartFromData();
        return;
      }

      if (user.id === this.userId) {
        return;
      }

      this.userId = user.id;
      void this.loadScans();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  get isEditing(): boolean {
    return this.editingScanId !== null;
  }

  get formTitle(): string {
    return this.isEditing ? this.content().editData : this.content().addData;
  }

  get submitLabel(): string {
    return this.isEditing ? this.content().updateButton : this.content().addButton;
  }

  getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  async addData(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage = null;

    if (!this.newDate) {
      alert(this.content().invalidDate);
      return;
    }

    const formValue = this.getFormValue();

    if (!formValue.weight && !formValue.fatPercentage && !formValue.muscleMass) {
      alert(this.content().invalidValue);
      return;
    }

    if (!this.userId) {
      this.errorMessage = this.content().saveError;
      return;
    }

    this.isSaving = true;

    try {
      if (this.editingScanId) {
        const updatedScan = await this.scanService.updateScan(this.userId, this.editingScanId, formValue);
        this.data = this.sortByDate(
          this.data.map((item) => (item.id === updatedScan.id ? updatedScan : item))
        );
      } else {
        const createdScan = await this.scanService.createScan(this.userId, formValue);
        this.data = this.sortByDate([...this.data, createdScan]);
      }

      this.syncChartFromData();
      this.cancelEdit();
    } catch (error) {
      console.error('Failed to save scan.', error);
      this.errorMessage = this.content().saveError;
    } finally {
      this.isSaving = false;
    }
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

  startEdit(item: ScanEntry): void {
    this.editingScanId = item.id;
    this.pendingDeleteScanId = null;
    this.newDate = item.date;
    this.weight = item.weight ?? null;
    this.value2 = item.fatPercentage ?? null;
    this.value3 = item.muscleMass ?? null;
  }

  cancelEdit(): void {
    this.editingScanId = null;
    this.pendingDeleteScanId = null;
    this.resetForm();
  }

  async toggleChartVisibility(item: ScanEntry): Promise<void> {
    if (!this.userId) {
      return;
    }

    this.errorMessage = null;

    const updatedValue = item.visibleInChart === false;
    const previousValue = item.visibleInChart !== false;
    this.data = this.data.map((entry) =>
      entry.id === item.id ? { ...entry, visibleInChart: updatedValue } : entry
    );
    this.syncChartFromData();

    try {
      const updatedScan = await this.scanService.updateScan(this.userId, item.id, {
        date: item.date,
        weight: item.weight ?? undefined,
        fatPercentage: item.fatPercentage ?? undefined,
        muscleMass: item.muscleMass ?? undefined,
        visibleInChart: updatedValue,
      });

      this.data = this.sortByDate(
        this.data.map((entry) => (entry.id === updatedScan.id ? updatedScan : entry))
      );
      this.syncChartFromData();
    } catch (error) {
      console.error('Failed to update chart visibility.', error);
      this.data = this.data.map((entry) =>
        entry.id === item.id ? { ...entry, visibleInChart: previousValue } : entry
      );
      this.syncChartFromData();
      this.errorMessage = this.content().saveError;
    }
  }

  requestDelete(scanId: string): void {
    this.pendingDeleteScanId = this.pendingDeleteScanId === scanId ? null : scanId;
  }

  async deleteData(scanId: string): Promise<void> {
    if (!this.userId) {
      return;
    }

    this.errorMessage = null;

    try {
      await this.scanService.deleteScan(this.userId, scanId);
      this.data = this.data.filter((item) => item.id !== scanId);

      if (this.editingScanId === scanId) {
        this.cancelEdit();
      }

      this.pendingDeleteScanId = null;
      this.syncChartFromData();
    } catch (error) {
      console.error('Failed to delete scan.', error);
      this.errorMessage = this.content().deleteError;
    }
  }

  isVisibleInChart(item: ScanEntry): boolean {
    return item.visibleInChart !== false;
  }

  formatMetric(value: number | null | undefined, unit: string): string {
    if (value == null) {
      return '-';
    }

    return `${this.formatValue(value)} ${unit}`;
  }

  formatDisplayDate(date: string): string {
    const parsedDate = this.parseDate(date);

    if (!parsedDate) {
      return date;
    }

    return new Intl.DateTimeFormat(this.languageService.language() === 'da' ? 'da-DK' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  }

  trackByScanId(_index: number, item: ScanEntry): string {
    return item.id;
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
            borderColor: this.getCSSVariable('--accent-color'),
            backgroundColor: this.getCSSVariable('--accent-color'),
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

  private getFormValue(): ScanFormValue {
    return {
      date: this.newDate,
      weight: this.normalizeValue(this.weight),
      fatPercentage: this.normalizeValue(this.value2),
      muscleMass: this.normalizeValue(this.value3),
      visibleInChart: this.editingScanId
        ? this.data.find((item) => item.id === this.editingScanId)?.visibleInChart !== false
        : true,
    };
  }

  private async loadScans(): Promise<void> {
    if (!this.userId) {
      this.data = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      this.data = this.sortByDate(await this.scanService.getScans(this.userId));
      this.syncChartFromData();
    } catch (error) {
      console.error('Failed to load scans.', error);
      this.errorMessage = this.content().loadError;
    } finally {
      this.isLoading = false;
    }
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
    const visibleScans = this.data.filter((item) => item.visibleInChart !== false);

    this.chart.data.labels = visibleScans.map((item) => this.formatDisplayDate(item.date));
    this.chart.data.datasets[0].label = this.content().weight;
    this.chart.data.datasets[0].data = visibleScans.map((item) => item.weight ?? null);
    this.chart.data.datasets[1].label = `${this.content().fat} ${this.content().percentUnit}`;
    this.chart.data.datasets[1].data = visibleScans.map((item) => item.fatPercentage ?? null);
    this.chart.data.datasets[2].label = this.content().muscle;
    this.chart.data.datasets[2].data = visibleScans.map((item) => item.muscleMass ?? null);

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

  private sortByDate(entries: ScanEntry[]): ScanEntry[] {
    return [...entries].sort((a, b) => a.date.localeCompare(b.date));
  }

  private parseDate(date: string): Date | null {
    const parsedDate = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private resetForm(): void {
    this.newDate = '';
    this.weight = null;
    this.value2 = null;
    this.value3 = null;
  }

  private formatValue(value: number): string {
    return new Intl.NumberFormat(this.languageService.language() === 'da' ? 'da-DK' : 'en-GB', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
}
