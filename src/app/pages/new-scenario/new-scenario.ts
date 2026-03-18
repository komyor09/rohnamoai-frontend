import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { SelectButton } from 'primeng/selectbutton';
import { Button } from 'primeng/button';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { MetaService } from '@/core/services/meta.service';
import { Region, ScenarioGoal } from '@/core/models';

interface ScenarioDraft {
    title: string;
    goal: ScenarioGoal | null;
    region_id: number | null;
    budgetOnly: boolean;
    language: string | null;
}

@Component({
    selector: 'app-new-scenario',
    templateUrl: './new-scenario.html',
    imports: [Select, Checkbox, FormsModule, SelectButton, Button, NgIf, NgFor, InputText],
    styleUrls: ['./new-scenario.scss']
})
export class NewScenarioComponent implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private metaService = inject(MetaService);
    private router = inject(Router);

    step = 0;
    submitting = false;
    error: string | null = null;

    scenario: ScenarioDraft = {
        title: '',
        goal: null,
        region_id: null,
        budgetOnly: false,
        language: null
    };

    goals = [
        { label: 'Бюджетное обучение', value: 'budget' as ScenarioGoal },
        { label: 'Престижный диплом', value: 'prestige' as ScenarioGoal },
        { label: 'Быстрое трудоустройство', value: 'job' as ScenarioGoal },
        { label: 'По месту жительства', value: 'location' as ScenarioGoal }
    ];

    regions: Region[] = [];
    languages = [
        { label: 'Русский', value: 'ru' },
        { label: 'Таджикский', value: 'tj' },
        { label: 'Английский', value: 'en' }
    ];

    constructor() {
        this.layoutService.setTitlePage('Новый сценарий');
    }

    ngOnInit(): void {
        this.metaService.getRegions().subscribe({
            next: (data) => { this.regions = data; }
        });
    }

    get regionOptions() {
        return this.regions.map(r => ({ label: r.name, value: r.id }));
    }

    next(): void {
        if (this.step < 2) this.step++;
    }

    back(): void {
        if (this.step > 0) this.step--;
    }

    get canProceedStep0(): boolean {
        return !!this.scenario.goal;
    }

    submit(): void {
        if (!this.scenario.goal) return;
        this.submitting = true;
        this.error = null;

        const title = this.scenario.title.trim() || this.goals.find(g => g.value === this.scenario.goal)?.label || 'Новый сценарий';

        this.scenariosService.create({ title, goal: this.scenario.goal }).subscribe({
            next: (created) => {
                // Save optional steps
                const steps: { step_key: string; step_value: string }[] = [];
                if (this.scenario.region_id) steps.push({ step_key: 'region_id', step_value: String(this.scenario.region_id) });
                if (this.scenario.language) steps.push({ step_key: 'language', step_value: this.scenario.language });
                if (this.scenario.budgetOnly) steps.push({ step_key: 'budget', step_value: 'true' });

                const saves = steps.map(s => this.scenariosService.saveStep(created.id, s));
                if (saves.length === 0) {
                    this.router.navigate(['/pages/scenario-edit', created.id]);
                    return;
                }

                let done = 0;
                saves.forEach(obs => obs.subscribe({ next: () => { done++; if (done === saves.length) this.router.navigate(['/pages/scenario-edit', created.id]); } }));
            },
            error: (err) => {
                this.submitting = false;
                this.error = err?.error?.detail ?? 'Ошибка создания сценария';
            }
        });
    }
}
