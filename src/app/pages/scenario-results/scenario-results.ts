import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScenariosService } from '@/core/services/scenarios.service';
import { SearchService } from '@/core/services/search.service';
import { AiService } from '@/core/services/ai.service';
import { Scenario, SearchResult } from '@/core/models';
import { Message } from 'primeng/message';
import { LayoutService } from '@/layout/service/layout.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'app-scenario-results',
    imports: [RouterLink, Message, Button, Card, Panel, Tag, FormsModule, SelectButton, PrimeTemplate, TableModule, Paginator, Select, MultiSelect],
    templateUrl: './scenario-results.html',
    styleUrls: ['./scenario-results.scss']
})
export class ScenarioResultsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private layoutService = inject(LayoutService);
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

    first2 = 0;
    rows2 = 5;
    regionOptions: any[] = [];
    languageOptions: any[] = [];

    pageOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 }
    ];

    // FILTER (budget / paid / all)
    _priceFilter = 'all';

    priceOptions = [
        { label: 'Все', value: 'all' },
        { label: 'Бюджет', value: 'free' },
        { label: 'Платные', value: 'paid' }
    ];

    constructor() {
        this.layoutService.setTitlePage('');
        this.layoutService.setTransparentBackground(true);
    }

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
        this.regionOptions = [...new Map(this.results.map((r) => [r.region, { label: r.region, value: r.region }])).values()];

        this.languageOptions = [...new Map(this.results.map((r) => [r.language, { label: r.language, value: r.language }])).values()];
    }

    get freeCount(): number {
        return this.results?.filter((r) => r.price === null).length || 0;
    }

    get paidCount(): number {
        return this.results?.filter((r) => r.price !== null).length || 0;
    }

    get filteredResults() {
        if (this.priceFilter === 'free') {
            return this.results.filter((r) => r.price === null);
        }

        if (this.priceFilter === 'paid') {
            return this.results.filter((r) => r.price !== null);
        }

        return this.results;
    }

    onPageChange2(event: any) {
        this.first2 = event.first;
        this.rows2 = event.rows;
    }

    loadResults(scenario: Scenario): void {
        this.searchService.search({ limit: 100 }).subscribe({
            next: (data) => {
                this.results = data;

                // ✅ ВАЖНО: строим options ПОСЛЕ загрузки
                this.regionOptions = [...new Map(data.map((r) => [r.region, { label: r.region, value: r.region }])).values()];

                this.languageOptions = [...new Map(data.map((r) => [r.language, { label: r.language, value: r.language }])).values()];

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

    openDetails(r: any) {
        this.router.navigate(['/pages/specialty-details', r.institution, r.specialty]);
    }

    budgetLabel(price: number | null): string {
        return price === null ? 'Бюджет' : `${price.toLocaleString()} сомони/год`;
    }
    get paginatedResults() {
        return this.filteredResults.slice(this.first2, this.first2 + this.rows2);
    }
    set priceFilter(value: string) {
        this._priceFilter = value;
        this.first2 = 0;
    }
    get priceFilter() {
        return this._priceFilter;
    }
}
