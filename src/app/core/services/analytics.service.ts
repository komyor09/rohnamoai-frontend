import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { AnalyticsOverview } from '../models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = inject(ApiClient);

  getOverview(): Observable<AnalyticsOverview> {
    return this.api.get<AnalyticsOverview>('/analytics/overview');
  }
}
