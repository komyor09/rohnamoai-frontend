import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { ComparisonResult, Scenario, ScenarioComparisonItem } from '@/core/models';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';

// Цвета для каждого сценария
const SCENARIO_COLORS = [
    { border: 'rgba(99,102,241,1)', bg: 'rgba(99,102,241,0.15)' },
    { border: 'rgba(34,197,94,1)', bg: 'rgba(34,197,94,0.15)' },
    { border: 'rgba(251,146,60,1)', bg: 'rgba(251,146,60,0.15)' }
];

@Component({
    selector: 'app-comparison-scenarios',
    templateUrl: './comparison-scenarios.html',
    imports: [RouterLink, Button, Card, ChartModule, Tag, Skeleton, Message, TableModule]
})
export class ComparisonScenarios implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);

    // ─── State ───────────────────────────────────────────────────────────
    scenarios = signal<Scenario[]>([]);
    selectedIds = signal<number[]>([]);
    resultsMap = signal<Record<number, number>>({});

    loading = signal(true);
    loadingCompare = signal(false);
    compareError = signal<string | null>(null);
    comparisonData = signal<ComparisonResult | null>(null);

    constructor() {
        this.layoutService.setTransparentBackground(true);
    }

    ngOnInit(): void {
        this.scenariosService.list().subscribe({
            next: (data) => {
                const completed = data.filter((s) => s.status === 'completed');
                this.scenarios.set(completed);
                this.loading.set(false);
                completed.forEach((s) => {
                    this.scenariosService.getResults(s.id).subscribe({
                        next: (res) => this.resultsMap.update((m) => ({ ...m, [s.id]: res.length })),
                        error: () => this.resultsMap.update((m) => ({ ...m, [s.id]: 0 }))
                    });
                });
            },
            error: () => this.loading.set(false)
        });
    }

    // ─── Selection ───────────────────────────────────────────────────────
    isSelected(id: number): boolean {
        return this.selectedIds().includes(id);
    }
    isDisabled(id: number): boolean {
        return !this.isSelected(id) && this.selectedIds().length >= 3;
    }

    toggleSelect(id: number): void {
        const current = this.selectedIds();
        if (current.includes(id)) {
            this.selectedIds.set(current.filter((i) => i !== id));
            // Сброс результата при изменении выбора
            this.comparisonData.set(null);
        } else if (current.length < 3) {
            this.selectedIds.set([...current, id]);
            this.comparisonData.set(null);
        }
    }

    canCompare = computed(() => this.selectedIds().length >= 2);

    runComparison(): void {
        if (!this.canCompare()) return;
        this.loadingCompare.set(true);
        this.compareError.set(null);
        this.comparisonData.set(null);

        this.scenariosService.compare(this.selectedIds()).subscribe({
            next: (data) => {
                this.comparisonData.set(data);
                this.loadingCompare.set(false);
            },
            error: (err) => {
                this.compareError.set(err?.error?.detail ?? 'Ошибка при сравнении');
                this.loadingCompare.set(false);
            }
        });
    }

    // ─── Chart data ──────────────────────────────────────────────────────
    radarData = computed(() => {
        const data = this.comparisonData();
        if (!data) return null;

        return {
            labels: ['Бюджет', 'Регион', 'Язык', 'Специальность'],
            datasets: data.scenarios.map((s, i) => ({
                label: s.title,
                data: [s.axes.budget, s.axes.region, s.axes.language, s.axes.specialty],
                borderColor: SCENARIO_COLORS[i]?.border,
                backgroundColor: SCENARIO_COLORS[i]?.bg,
                borderWidth: 2,
                pointBackgroundColor: SCENARIO_COLORS[i]?.border,
                pointRadius: 4
            }))
        };
    });

    radarOptions = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: { stepSize: 25, display: false },
                grid: { color: 'rgba(150,150,150,0.15)' },
                pointLabels: { font: { size: 13, weight: '600' } }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { usePointStyle: true, padding: 20 }
            }
        }
    };

    barData = computed(() => {
        const data = this.comparisonData();
        if (!data) return null;

        return {
            labels: ['Всего', 'Бюджетных'],
            datasets: data.scenarios.map((s, i) => ({
                label: s.title,
                data: [s.total_results, s.free_count],
                backgroundColor: SCENARIO_COLORS[i]?.bg,
                borderColor: SCENARIO_COLORS[i]?.border,
                borderWidth: 2,
                borderRadius: 6
            }))
        };
    });

    barOptions = {
        responsive: true,
        plugins: { legend: { position: 'bottom' as const } },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    // ─── Helpers ─────────────────────────────────────────────────────────
    getResultCount(s: Scenario): number {
        return this.resultsMap()[s.id] ?? 0;
    }

    isWinner(s: ScenarioComparisonItem): boolean {
        return this.comparisonData()?.winner_id === s.id;
    }

    scoreSeverity(score: number): 'success' | 'warn' | 'danger' {
        if (score >= 70) return 'success';
        if (score >= 45) return 'warn';
        return 'danger';
    }

    axisLabel(key: string): string {
        const map: Record<string, string> = {
            budget: 'Бюджет',
            region: 'Регион',
            language: 'Язык',
            specialty: 'Специальность'
        };
        return map[key] ?? key;
    }

    goalLabel(goal: string): string {
        const map: Record<string, string> = {
            budget: 'Бюджет',
            prestige: 'Престиж',
            job: 'Трудоустройство',
            location: 'Локация'
        };
        return map[goal] ?? goal;
    }

    budgetLabel(price: number | null): string {
        return price === null ? 'Бюджет' : `${price.toLocaleString()} сом`;
    }

    scenarioColor(index: number): string {
        return SCENARIO_COLORS[index]?.border ?? '#999';
    }

    getAxesEntries(axes: Record<string, number>): { key: string; value: number }[] {
        return Object.entries(axes).map(([key, value]) => ({ key, value }));
    }
}
