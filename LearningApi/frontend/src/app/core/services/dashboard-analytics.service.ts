import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DashboardAnalytics } from '../models/dashboard-analytics';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardAnalyticsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/dashboard/analytics`;

  constructor(http: HttpClient) {
    super(http);
  }

  getAnalytics(): Observable<DashboardAnalytics> {
    return this.get<DashboardAnalytics>(this.apiUrl);
  }
}
