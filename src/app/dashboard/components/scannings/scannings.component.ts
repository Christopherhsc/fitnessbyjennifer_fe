import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-scannings',
  templateUrl: './scannings.component.html',
  styleUrl: './scannings.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ScanningsComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart;

  sortDirection: 'asc' | 'desc' = 'asc';
  newDate: string = '';
  weight: number = 0;
  value2: number = 0;
  value3: number = 0;

  data: { date: string; weight?: number; fatPercentage?: number; muscleMass?: number }[] = [];

  ngAfterViewInit() {
    this.initChart();
  }

  /** ✅ Initialize Chart */
  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Vægt',
            data: [],
            borderColor: this.getCSSVariable('--main-color'),
            backgroundColor: this.getCSSVariable('--main-color'),
          },
          {
            label: 'Fedt %',
            data: [],
            borderColor: this.getCSSVariable('--text-color'),
            backgroundColor: this.getCSSVariable('--text-color'),
          },
          {
            label: 'Muskelmasse',
            data: [],
            borderColor: this.getCSSVariable('--niche-color'),
            backgroundColor: this.getCSSVariable('--niche-color')
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          x: { title: { display: true, text: 'Dato' } },
          y: { title: { display: true, text: 'Værdier' }, min: 0 },
        },
      },
    });
  }

  /** 🔹 Extract CSS variable values dynamically */
  getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }

  addData(event: Event): void {
    event.preventDefault();
  
    if (!this.newDate) {
      alert('Indtast en gyldig dato!');
      return;
    }
  
    const newValues = [
      { value: this.weight, datasetIndex: 0 },
      { value: this.value2, datasetIndex: 1 },
      { value: this.value3, datasetIndex: 2 },
    ];
  
    const validValues = newValues.filter(
      (item) => !isNaN(item.value) && item.value !== null && item.value !== undefined && item.value !== 0
    );
  
    if (validValues.length === 0) {
      alert('Indtast mindst én gyldig værdi!');
      return;
    }
  
    if (!this.chart.data.labels?.includes(this.newDate)) {
      this.chart.data.labels?.push(this.newDate);
    }
  
    validValues.forEach(({ value, datasetIndex }) => {
      const dataset = this.chart.data.datasets[datasetIndex];
      if (dataset.data.length < this.chart.data.labels!.length) {
        dataset.data.push(value);
      }
    });
  
    this.data.push({
      date: this.newDate,
      weight: this.weight || undefined,
      fatPercentage: this.value2 || undefined,
      muscleMass: this.value3 || undefined,
    });
    
    this.chart.update();
    this.resetForm();
  }

  sortData(column: 'date' | 'vægt' | 'fedt' | 'muskelmasse'): void {
    const keyMap: Record<'date' | 'vægt' | 'fedt' | 'muskelmasse', keyof typeof this.data[0]> = {
      date: 'date',
      vægt: 'weight',
      fedt: 'fatPercentage',
      muskelmasse: 'muscleMass',
    };
  
    const key = keyMap[column];
  
    this.data.sort((a, b) => {
      let aValue: string | number | undefined = a[key];
      let bValue: string | number | undefined = b[key];
  
      if (aValue == null) aValue = -Infinity;
      if (bValue == null) bValue = -Infinity;
  
      return this.sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  
    // Toggle sorting direction for the next click
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
  
  
  
  deleteData(index: number): void {
    const [removed] = this.data.splice(index, 1);
  
    const labelIndex = this.chart.data.labels?.indexOf(removed.date) ?? -1;
  
    if (labelIndex > -1) {
      this.chart.data.labels?.splice(labelIndex, 1);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(labelIndex, 1);
      });
    }
  
    this.chart.update();
  }
  
  resetForm(): void {
    this.newDate = '';
    this.weight = 0;
    this.value2 = 0;
    this.value3 = 0;
  }
  
  

}
