import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchService } from '@/core/services/search.service';
import { AiService } from '@/core/services/ai.service';
import { SearchResult } from '@/core/models';

@Component({
    selector: 'app-specialty-details',
    imports: [RouterLink],
    templateUrl: './specialty-details.html',
    styleUrls: ['./specialty-details.scss']
})
export class SpecialtyDetails implements OnInit {
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);
    private aiService = inject(AiService);

    institution = '';
    specialtyName = '';
    result: SearchResult | null = null;
    aiText: string | null = null;
    loading = true;
    loadingAi = false;

    ngOnInit(): void {
        this.institution = decodeURIComponent(this.route.snapshot.paramMap.get('institution') ?? '');
        this.specialtyName = decodeURIComponent(this.route.snapshot.paramMap.get('specialty') ?? '');

        this.searchService.search({ specialty: this.specialtyName, limit: 5 }).subscribe({
            next: (data) => {
                this.result = data.find(r => r.institution === this.institution) ?? data[0] ?? null;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    getAiInsight(): void {
        if (!this.result) return;
        this.loadingAi = true;
        this.aiService.explain({ results: [this.result] }).subscribe({
            next: (res) => { this.aiText = res.text; this.loadingAi = false; },
            error: () => { this.loadingAi = false; }
        });
    }

    budgetLabel(price: number | null): string {
        return price === null ? 'Бюджет (бесплатно)' : `${price.toLocaleString()} сом/год`;
    }
}
