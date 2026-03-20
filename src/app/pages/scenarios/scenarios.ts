import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { Scenario } from '@/core/models';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
@Component({
    selector: 'app-scenarios',
    templateUrl: './scenarios.html',
    imports: [NgClass, RouterLink, Button, Message, Tooltip, Card, Tag],
    styleUrls: ['./scenarios.scss']
})
export class Scenarios implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private router = inject(Router);

    scenarios: Scenario[] = [];
    loading = true;
    error: string | null = null;
    deletingId: number | null = null;

    welcomeMessage = 'Каждый сценарий — отдельный путь выбора поступления';

    constructor() {
        this.layoutService.setTitlePage('Мои сценарии');
    }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;
        this.scenariosService.list().subscribe({
            next: (data) => {
                this.scenarios = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Ошибка загрузки';
                this.loading = false;
            }
        });
    }

    openScenario(s: Scenario): void {
        if (s.status === 'completed') {
            this.router.navigate(['/pages/scenario-results', s.id]);
        } else {
            this.router.navigate(['/pages/scenario-edit', s.id]);
        }
    }

    deleteScenario(id: number, event: Event): void {
        event.stopPropagation();
        if (!confirm('Удалить сценарий?')) return;
        this.deletingId = id;
        this.scenariosService.delete(id).subscribe({
            next: () => {
                this.scenarios = this.scenarios.filter((s) => s.id !== id);
                this.deletingId = null;
            },
            error: () => {
                this.deletingId = null;
            }
        });
    }

    goalLabel(goal: string): string {
        const map: Record<string, string> = { budget: 'Бюджет', prestige: 'Престиж', job: 'Трудоустройство', location: 'Локация' };
        return map[goal] ?? goal;
    }

    getStatusLabel(status: string): string {
        return status === 'completed' ? 'Завершён' : 'Черновик';
    }

    getStatusStyle(status: string): string {
        return status === 'completed' ? 'success' : 'warn';
    }

    getStatusIcon(status: string): string {
        return status === 'completed' ? 'pi pi-check' : 'pi pi-clock';
    }
}
