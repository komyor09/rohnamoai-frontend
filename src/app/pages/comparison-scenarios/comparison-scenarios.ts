import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { Scenario } from '@/core/models';

@Component({
    selector: 'app-comparison-scenarios',
    templateUrl: './comparison-scenarios.html',
    imports: [RouterLink],
    styleUrls: ['./comparison-scenarios.scss']
})
export class ComparisonScenarios implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);

    scenarios: Scenario[] = [];
    selectedIds: number[] = [];
    loading = true;

    constructor() {
        this.layoutService.setTitlePage('Сравнение сценариев');
    }

    ngOnInit(): void {
        this.scenariosService.list().subscribe({
            next: (data) => { this.scenarios = data.filter(s => s.status === 'completed'); this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    toggleSelect(id: number): void {
        if (this.selectedIds.includes(id)) {
            this.selectedIds = this.selectedIds.filter(i => i !== id);
        } else if (this.selectedIds.length < 3) {
            this.selectedIds = [...this.selectedIds, id];
        }
    }

    isSelected(id: number): boolean {
        return this.selectedIds.includes(id);
    }

    get selectedScenarios(): Scenario[] {
        return this.scenarios.filter(s => this.selectedIds.includes(s.id));
    }

    goalLabel(goal: string): string {
        const map: Record<string, string> = { budget: 'Бюджет', prestige: 'Престиж', job: 'Трудоустройство', location: 'Локация' };
        return map[goal] ?? goal;
    }
}
