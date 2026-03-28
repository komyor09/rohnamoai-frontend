import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { AnalyticsService } from '@/core/services/analytics.service';
import { Scenario } from '@/core/models';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Card } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';

interface HomeState {
    scenarios: Scenario[];
    totalSearches: number;
    loading: boolean;
    error: string | null;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, Button, Message, Tag, Card, PrimeTemplate],
    templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private analyticsService = inject(AnalyticsService);

    state: HomeState = {
        scenarios: [],
        totalSearches: 0,
        loading: true,
        error: null
    };

    userName = 'Комёр';

    constructor() {
        this.layoutService.setTitlePage(``);
        this.layoutService.setTransparentBackground(true);
    }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData() {
        this.scenariosService.list().subscribe({
            next: (data) => {
                this.state.scenarios = data;
                this.state.loading = false;
            },
            error: () => {
                this.state.error = 'Ошибка загрузки';
                this.state.loading = false;
            }
        });

        this.analyticsService.getOverview().subscribe({
            next: (data) => {
                this.state.totalSearches = data.total_searches;
            }
        });
    }

    get completedCount(): number {
        return this.state.scenarios.filter((s) => s.status === 'completed').length;
    }

    get draftCount(): number {
        return this.state.scenarios.filter((s) => s.status === 'draft').length;
    }

    get firstDraft(): Scenario | null {
        return this.state.scenarios.find((s) => s.status === 'draft') ?? null;
    }

    get readiness(): number {
        const total = this.state.scenarios.length;
        return total === 0 ? 0 : Math.round((this.completedCount / total) * 100);
    }

    ngOnDestroy(): void {
        this.layoutService.setTransparentBackground(false);
    }
}
