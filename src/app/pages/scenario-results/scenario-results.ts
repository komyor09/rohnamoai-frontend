import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScenariosService } from '@/core/services/scenarios.service';
import { SearchService } from '@/core/services/search.service';
import { AiService } from '@/core/services/ai.service';
import { Scenario, SearchResult } from '@/core/models';

@Component({
    selector: 'app-scenario-results',
    imports: [RouterLink, NgClass],
    templateUrl: './scenario-results.html',
    styleUrls: ['./scenario-results.scss']
})
export class ScenarioResultsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private scenariosService = inject(ScenariosService);
    private searchService = inject(SearchService);
    private aiService = inject(AiService);

    scenarioId!: number;
    scenario: Scenario | null = null;
    results: SearchResult[] = [];
    aiExplanation: string | null = null;
    loading = true;
    loadingAi = false;
    error: string | null = null;

    ngOnInit(): void {
        this.scenarioId = Number(this.route.snapshot.paramMap.get('id'));
        this.scenariosService.get(this.scenarioId).subscribe({
            next: (s) => {
                this.scenario = s;
                this.loadResults(s);
            },
            error: () => {
                this.error = 'Сценарий не найден';
                this.loading = false;
            }
        });
    }

    get freeCount(): number {
        return this.results?.filter((r) => r.price === null).length || 0;
    }

    get paidCount(): number {
        return this.results?.filter((r) => r.price !== null).length || 0;
    }

    loadResults(scenario: Scenario): void {
        // Use search endpoint to fetch results matching the scenario goal
        const params: Record<string, string | boolean> = {};
        if (scenario.goal === 'budget') params['budget'] = true;

        this.searchService.search({ limit: 20 }).subscribe({
            next: (data) => {
                this.results = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Ошибка загрузки результатов';
                this.loading = false;
            }
        });
    }

    getAiExplanation(): void {
        this.loadingAi = true;
        this.aiService.explainScenario(this.scenarioId).subscribe({
            next: (res) => {
                this.aiExplanation = res.text;
                this.loadingAi = false;
            },
            error: () => {
                // Fallback to generic explain
                this.aiService.explain({ results: this.results, user_goal: this.scenario?.goal }).subscribe({
                    next: (res) => {
                        this.aiExplanation = res.text;
                        this.loadingAi = false;
                    },
                    error: () => {
                        this.loadingAi = false;
                    }
                });
            }
        });
    }

    budgetLabel(price: number | null): string {
        return price === null ? 'Бюджет' : `${price.toLocaleString()} сом/год`;
    }
}
