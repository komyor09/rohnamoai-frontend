import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { Scenario } from '@/core/models';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { SelectButton } from 'primeng/selectbutton';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-scenarios',
    templateUrl: './scenarios.html',
    imports: [Button, Tag, FormsModule, InputText, TableModule, Toolbar, IconField, InputIcon, SelectButton, Card, Tooltip, RouterLink],
    styleUrls: ['./scenarios.scss']
})
export class Scenarios implements OnInit {
    protected layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private router = inject(Router);

    isMobile = this.layoutService.isMobile;
    scenarios: Scenario[] = [];
    loading = true;
    error: string | null = null;
    deletingId: number | null = null;

    filterOptions = [
        { label: 'Все', value: 'all' },
        { label: 'Черновики', value: 'draft' },
        { label: 'Завершённые', value: 'completed' }
    ];

    filter: string = 'all';
    search = '';

    constructor() {
        this.layoutService.setTitlePage('');
        this.layoutService.setTransparentBackground(true);
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

    getStatusStyle(status: string): 'success' | 'warn' {
        return status === 'completed' ? 'success' : 'warn';
    }

    getStatusIcon(status: string): string {
        return status === 'completed' ? 'pi pi-check' : 'pi pi-clock';
    }

    get filtered(): Scenario[] {
        return this.scenarios
            .filter((s) => {
                if (this.filter === 'all') return true;
                return s.status === this.filter;
            })
            .filter((s) => s.title.toLowerCase().includes(this.search.toLowerCase()));
    }
}
