import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { AnalyticsService } from '@/core/services/analytics.service';
import { Scenario } from '@/core/models';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
@Component({
    selector: 'app-home',
    imports: [NgClass, RouterLink, Button, Message, Tooltip, Card, Tag],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private analyticsService = inject(AnalyticsService);

    scenarios: Scenario[] = [];
    totalSearches = 0;
    loading = true;
    error: string | null = null;

    userName = 'Комёр';
    welcomeMessage = 'Сравнивайте сценарии и принимайте осознанные решения о поступлении';
    get completedScenarios(): Scenario[] {
        return this.scenarios.filter((s) => s.status === 'completed');
    }
    get draftScenarios(): Scenario[] {
        return this.scenarios.filter((s) => s.status === 'draft');
    }
    get firstDraft(): Scenario | null {
        return this.draftScenarios[0] ?? null;
    }
    get readinessPercent(): number {
        return this.scenarios.length === 0 ? 0 : Math.round((this.completedScenarios.length / this.scenarios.length) * 100);
    }

    goalLabel(goal: string): string {
        const map: Record<string, string> = { budget: 'Бюджет', prestige: 'Престиж', job: 'Трудоустройство', location: 'Локация' };
        return map[goal] ?? goal;
    }
    statusLabel(s: string): string {
        return s === 'completed' ? 'Завершён' : 'Черновик';
    }
    statusClass(s: string): string {
        return s === 'completed' ? 'success' : 'warn';
    }

    constructor() {
        this.layoutService.setTitlePage('Добро пожаловать, ' + this.userName + '!');
        this.layoutService.setTransparentBackground(true);
    }

    ngOnInit(): void {
        this.scenariosService.list().subscribe({
            next: (data) => {
                this.scenarios = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Не удалось загрузить данные';
                this.loading = false;
            }
        });
        this.analyticsService.getOverview().subscribe({
            next: (data) => {
                this.totalSearches = data.total_searches;
            }
        });
    }

    ngOnDestroy(): void {
        this.layoutService.setTransparentBackground(false);
    }
}
