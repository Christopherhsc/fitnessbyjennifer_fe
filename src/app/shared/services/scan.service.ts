import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ScanEntry {
  id: string;
  date: string;
  weight?: number | null;
  fatPercentage?: number | null;
  muscleMass?: number | null;
  visibleInChart?: boolean;
}

interface ScanListResponse {
  scans: ScanEntry[];
}

interface ScanResponse {
  scan: ScanEntry;
}

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private readonly http = inject(HttpClient);

  getScans(userId: string): Promise<ScanEntry[]> {
    return firstValueFrom(
      this.http.get<ScanListResponse>(`${environment.apiBaseUrl}/users/${userId}/scans`)
    ).then((response) => response.scans);
  }

  createScan(userId: string, scan: Omit<ScanEntry, 'id'>): Promise<ScanEntry> {
    return firstValueFrom(
      this.http.post<ScanResponse>(`${environment.apiBaseUrl}/users/${userId}/scans`, scan)
    ).then((response) => response.scan);
  }

  updateScan(userId: string, scanId: string, scan: Omit<ScanEntry, 'id'>): Promise<ScanEntry> {
    return firstValueFrom(
      this.http.put<ScanResponse>(`${environment.apiBaseUrl}/users/${userId}/scans/${scanId}`, scan)
    ).then((response) => response.scan);
  }

  deleteScan(userId: string, scanId: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${environment.apiBaseUrl}/users/${userId}/scans/${scanId}`)
    ).then(() => undefined);
  }
}
