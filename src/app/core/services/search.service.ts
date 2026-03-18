import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { SearchResult, SearchParams } from '../models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private api = inject(ApiClient);

  search(params: SearchParams): Observable<SearchResult[]> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.language) queryParams['language'] = params.language;
    if (params.specialty) queryParams['specialty'] = params.specialty;
    if (params.budget !== undefined) queryParams['budget'] = params.budget;
    if (params.region_id) queryParams['region_id'] = params.region_id;
    if (params.district_id) queryParams['district_id'] = params.district_id;
    if (params.locality_id) queryParams['locality_id'] = params.locality_id;
    if (params.sort) queryParams['sort'] = params.sort;
    if (params.order) queryParams['order'] = params.order;
    if (params.limit) queryParams['limit'] = params.limit;
    return this.api.get<SearchResult[]>('/search/', queryParams);
  }
}
