import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { LayoutService } from '@/layout/service/layout.service';
import { ScenariosService } from '@/core/services/scenarios.service';
import { MetaService } from '@/core/services/meta.service';
import { Region, ScenarioGoal } from '@/core/models';
import { Card } from 'primeng/card';
import { Steps } from 'primeng/steps';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';

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
    imports: [Select, Checkbox, FormsModule, InputText, Card, Steps, Message, Button, NgClass],
    styleUrls: ['./new-scenario.scss'],
    animations: [
        trigger('stepAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'translateY(10px)' }), animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
            transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))])
        ])
    ]
})
export class NewScenarioComponent implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private metaService = inject(MetaService);
    private router = inject(Router);

    step = 0;
    submitting = false;
    error: string | null = null;

    stepItems = [
        {
            label: 'Цель',
            command: () => this.goToStep(0)
        },
        {
            label: 'Предпочтения',
            command: () => !this.isStepDisabled(1) && this.goToStep(1)
        },
        {
            label: 'Подтверждение',
            command: () => !this.isStepDisabled(2) && this.goToStep(2)
        }
    ];

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
        this.layoutService.setTitlePage('');
        this.layoutService.setTransparentBackground(true);
    }

    ngOnInit(): void {
        this.metaService.getRegions().subscribe({
            next: (data) => {
                this.regions = data;
            }
        });
    }
    get selectedGoalLabel(): string {
        return this.goals.find((g) => g.value === this.scenario.goal)?.label || 'Мой сценарий';
    }

    get selectedRegionLabel(): string | null {
        return this.regionOptions.find((r) => r.value === this.scenario.region_id)?.label || null;
    }

    get selectedLanguageLabel(): string | null {
        return this.languages.find((l) => l.value === this.scenario.language)?.label || null;
    }

    get regionOptions() {
        return this.regions.map((r) => ({ label: r.name, value: r.id }));
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

    goToStep(target: number) {
        switch (target) {
            case 1:
                if (!this.scenario.goal) return;
                break;

            case 2:
                if (!this.scenario.goal) return;
                break;
        }

        this.step = target;
    }

    isStepDisabled(index: number) {
        if (index === 1) return !this.scenario.goal;
        if (index === 2) return !this.scenario.goal;
        return false;
    }

    submit(): void {
        if (!this.scenario.goal) return;
        this.submitting = true;
        this.error = null;

        const title = this.scenario.title.trim() || this.goals.find((g) => g.value === this.scenario.goal)?.label || 'Новый сценарий';

        this.scenariosService.create({ title, goal: this.scenario.goal }).subscribe({
            next: (created) => {
                // Save optional steps
                const steps: { step_key: string; step_value: string }[] = [];
                if (this.scenario.region_id) steps.push({ step_key: 'region_id', step_value: String(this.scenario.region_id) });
                if (this.scenario.language) steps.push({ step_key: 'language', step_value: this.scenario.language });
                if (this.scenario.budgetOnly) steps.push({ step_key: 'budget', step_value: 'true' });

                const saves = steps.map((s) => this.scenariosService.saveStep(created.id, s));
                if (saves.length === 0) {
                    this.router.navigate(['/pages/scenario-edit', created.id]);
                    return;
                }

                let done = 0;
                saves.forEach((obs) =>
                    obs.subscribe({
                        next: () => {
                            done++;
                            if (done === saves.length) this.router.navigate(['/pages/scenario-edit', created.id]);
                        }
                    })
                );
            },
            error: (err) => {
                this.submitting = false;
                if (err?.error?.detail === 'Scenario limit reached') {
                    this.error = 'Лимит создания сценарий 3.';
                } else {
                    this.error = err?.error?.detail ?? 'Ошибка создания сценария';
                }
            }
        });
    }
}
