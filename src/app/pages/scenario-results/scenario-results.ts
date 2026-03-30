import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ScenariosService } from '@/core/services/scenarios.service';
import { AiService } from '@/core/services/ai.service';
import { LayoutService } from '@/layout/service/layout.service';
import { BudgetOption, Scenario, SearchResult, SelectOption } from '@/core/models';

@Component({
    selector: 'app-scenario-results',
    imports: [RouterLink, TableModule, Button, Tag, MultiSelect, Message, Card, Skeleton, SelectButton, FormsModule],
    templateUrl: './scenario-results.html',
    styleUrls: ['./scenario-results.scss']
})
export class ScenarioResults implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private aiService = inject(AiService);

    // ─── State ───────────────────────────────────────────────────────────
    scenarioId!: number;
    scenario: Scenario | null = null;

    results = signal<SearchResult[]>([]);
    loading = signal(true);
    loadingAi = signal(false);
    error = signal<string | null>(null);
    aiExplanation = signal<string | null>(null);

    // ─── Filters state ───────────────────────────────────────────────────
    selectedRegions = signal<string[]>([]);
    selectedLanguages = signal<string[]>([]);
    selectedBudget = signal<'all' | 'free' | 'paid'>('all');

    // ─── Filter options (computed from data) ─────────────────────────────
    regionOptions = computed<SelectOption[]>(() => {
        const unique = [
            ...new Set(
                this.results()
                    .map((r) => r.region)
                    .filter(Boolean)
            )
        ];
        return unique.sort().map((v) => ({ label: v, value: v }));
    });

    languageOptions = computed<SelectOption[]>(() => {
        const allLangs = this.results().flatMap((r) =>
            r.language
                .split(',')
                .map((l) => l.trim())
                .filter(Boolean)
        );
        const unique = [...new Set(allLangs)];
        return unique.sort().map((v) => ({ label: v, value: v }));
    });

    budgetOptions: BudgetOption[] = [
        { label: 'Все', value: 'all' },
        { label: 'Бюджет', value: 'free' },
        { label: 'Платные', value: 'paid' }
    ];

    // ─── Filtered results ─────────────────────────────────────────────────
    filteredResults = computed<SearchResult[]>(() => {
        let data = this.results();

        const regions = this.selectedRegions();
        if (regions.length > 0) {
            data = data.filter((r) => regions.includes(r.region));
        }

        const langs = this.selectedLanguages();
        if (langs.length > 0) {
            data = data.filter((r) => langs.some((l) => r.language.includes(l)));
        }

        const budget = this.selectedBudget();
        if (budget === 'free') data = data.filter((r) => r.price === null);
        if (budget === 'paid') data = data.filter((r) => r.price !== null);

        return data;
    });

    // ─── KPI ─────────────────────────────────────────────────────────────
    freeCount = computed(() => this.results().filter((r) => r.price === null).length);
    paidCount = computed(() => this.results().filter((r) => r.price !== null).length);
    avgScore = computed(() => {
        const list = this.results();
        if (!list.length) return 0;
        return Math.round(list.reduce((acc, r) => acc + (r.score ?? 0), 0) / list.length);
    });

    constructor() {
        this.layoutService.setTransparentBackground(true);
    }

    ngOnInit(): void {
        this.scenarioId = Number(this.route.snapshot.paramMap.get('id'));
        this.scenariosService.get(this.scenarioId).subscribe({
            next: (s) => {
                this.scenario = s;
                this.loadResults();
            },
            error: () => {
                this.error.set('Сценарий не найден');
                this.loading.set(false);
            }
        });
    }

    loadResults(): void {
        this.scenariosService.getResults(this.scenarioId).subscribe({
            next: (data) => {
                this.results.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Ошибка загрузки результатов');
                this.loading.set(false);
            }
        });
    }

    getAiExplanation(): void {
        this.loadingAi.set(true);
        this.aiService.explainScenario(this.scenarioId).subscribe({
            next: (res) => {
                this.aiExplanation.set(res.text);
                this.loadingAi.set(false);
            },
            error: () => {
                this.aiService.explain({ results: this.results(), user_goal: this.scenario?.goal }).subscribe({
                    next: (res) => {
                        this.aiExplanation.set(res.text);
                        this.loadingAi.set(false);
                    },
                    error: () => this.loadingAi.set(false)
                });
            }
        });
    }

    openDetail(r: SearchResult): void {
        this.router.navigate(['/pages/specialty-details', r.institution, r.specialty]);
    }

    resetFilters(): void {
        this.selectedRegions.set([]);
        this.selectedLanguages.set([]);
        this.selectedBudget.set('all');
    }

    // ─── UI helpers ──────────────────────────────────────────────────────
    scoreSeverity(score: number | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
        if (!score) return 'secondary';
        if (score >= 70) return 'success';
        if (score >= 40) return 'warn';
        return 'danger';
    }

    budgetSeverity(price: number | null): 'success' | 'secondary' {
        return price === null ? 'success' : 'secondary';
    }

    budgetLabel(price: number | null): string {
        return price === null ? 'Бюджет' : `${price.toLocaleString()} сом`;
    }

    hasActiveFilters(): boolean {
        return this.selectedRegions().length > 0 || this.selectedLanguages().length > 0 || this.selectedBudget() !== 'all';
    }
}
