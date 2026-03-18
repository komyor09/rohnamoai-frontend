import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import {
  Scenario,
  CreateScenarioRequest,
  ScenarioStep,
  CompleteScenarioResponse
} from '../models';

@Injectable({ providedIn: 'root' })
export class ScenariosService {
  private api = inject(ApiClient);

  list(): Observable<Scenario[]> {
    return this.api.get<Scenario[]>('/scenarios');
  }

  get(id: number): Observable<Scenario> {
    return this.api.get<Scenario>(`/scenarios/${id}`);
  }

  create(data: CreateScenarioRequest): Observable<Scenario> {
    return this.api.post<Scenario>('/scenarios', data);
  }

  delete(id: number): Observable<{ ok: boolean }> {
    return this.api.delete<{ ok: boolean }>(`/scenarios/${id}`);
  }

  saveStep(scenarioId: number, step: ScenarioStep): Observable<{ ok: boolean }> {
    return this.api.post<{ ok: boolean }>(`/scenarios/${scenarioId}/step`, step);
  }

  complete(scenarioId: number): Observable<CompleteScenarioResponse> {
    return this.api.post<CompleteScenarioResponse>(`/scenarios/${scenarioId}/complete`, {});
  }
}
