import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import {
  ExplainRequest,
  ExplainResponse,
  DialogRequest,
  DialogResponse
} from '../models';

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = inject(ApiClient);

  explain(data: ExplainRequest): Observable<ExplainResponse> {
    return this.api.post<ExplainResponse>('/ai/explain', data);
  }

  dialog(data: DialogRequest): Observable<DialogResponse> {
    return this.api.post<DialogResponse>('/ai/dialog', data);
  }

  explainScenario(scenarioId: number): Observable<ExplainResponse> {
    return this.api.get<ExplainResponse>(`/ai/scenario/${scenarioId}/explain`);
  }
}
