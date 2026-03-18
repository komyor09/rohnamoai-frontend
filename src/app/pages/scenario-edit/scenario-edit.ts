import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ScenariosService } from '@/core/services/scenarios.service';
import { MetaService } from '@/core/services/meta.service';
import { Scenario, Region } from '@/core/models';

@Component({
    selector: 'app-scenario-edit',
    templateUrl: './scenario-edit.html',
    imports: [FormsModule, Select, Checkbox, Button, InputText, NgIf, NgFor, RouterLink],
    styleUrls: ['./scenario-edit.scss']
})
export class ScenarioEdit implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private scenariosService = inject(ScenariosService);
    private metaService = inject(MetaService);

    scenarioId!: number;
    scenario: Scenario | null = null;
    loading = true;
    saving = false;
    completing = false;
    error: string | null = null;
    successMsg: string | null = null;

    regions: Region[] = [];

    // Editable step fields
    regionId: number | null = null;
    language: string | null = null;
    budgetOnly = false;
    specialty: string | null = null;

    languages = [
        { label: 'Русский', value: 'ru' },
        { label: 'Таджикский', value: 'tj' },
        { label: 'Английский', value: 'en' }
    ];

    goalLabel(goal: string): string {
        const map: Record<string, string> = { budget: 'Бюджет', prestige: 'Престиж', job: 'Трудоустройство', location: 'Локация' };
        return map[goal] ?? goal;
    }

    get regionOptions() {
        return this.regions.map(r => ({ label: r.name, value: r.id }));
    }

    ngOnInit(): void {
        this.scenarioId = Number(this.route.snapshot.paramMap.get('id'));
        this.metaService.getRegions().subscribe({ next: d => this.regions = d });
        this.scenariosService.get(this.scenarioId).subscribe({
            next: (s) => { this.scenario = s; this.loading = false; },
            error: () => { this.error = 'Сценарий не найден'; this.loading = false; }
        });
    }

    saveSteps(): void {
        if (!this.scenario) return;
        this.saving = true;
        this.error = null;
        const steps: { step_key: string; step_value: string }[] = [];
        if (this.regionId) steps.push({ step_key: 'region_id', step_value: String(this.regionId) });
        if (this.language) steps.push({ step_key: 'language', step_value: this.language });
        if (this.budgetOnly) steps.push({ step_key: 'budget', step_value: 'true' });
        if (this.specialty) steps.push({ step_key: 'specialty', step_value: this.specialty });

        if (steps.length === 0) { this.saving = false; this.successMsg = 'Параметры сохранены'; return; }

        let done = 0;
        steps.forEach(s => {
            this.scenariosService.saveStep(this.scenarioId, s).subscribe({
                next: () => { done++; if (done === steps.length) { this.saving = false; this.successMsg = 'Параметры сохранены'; } },
                error: () => { this.saving = false; this.error = 'Ошибка сохранения'; }
            });
        });
    }

    complete(): void {
        if (!this.scenario) return;
        this.completing = true;
        this.error = null;
        // Save steps first, then complete
        this.saveStepsAndComplete();
    }

    private saveStepsAndComplete(): void {
        this.scenariosService.complete(this.scenarioId).subscribe({
            next: (res) => {
                this.completing = false;
                this.router.navigate(['/pages/scenario-results', this.scenarioId]);
            },
            error: (err) => {
                this.completing = false;
                this.error = err?.error?.detail ?? 'Ошибка завершения сценария';
            }
        });
    }
}
