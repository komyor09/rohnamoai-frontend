import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { Region, District, Locality } from '../models';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private api = inject(ApiClient);

  getRegions(): Observable<Region[]> {
    return this.api.get<Region[]>('/meta/regions');
  }

  getDistricts(regionId: number): Observable<District[]> {
    return this.api.get<District[]>('/meta/districts', { region_id: regionId });
  }

  getLocalities(districtId: number): Observable<Locality[]> {
    return this.api.get<Locality[]>('/meta/localities', { district_id: districtId });
  }
}
