import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';

interface Scenario {
    id: number;
    title: string;
    goal: string;
    region: string;
    fields: string[];
    constraints: {
        budgetOnly: boolean;
        language: string | null;
    };
    status: 'draft' | 'completed';
}

@Component({
    selector: 'app-scenario-edit',
    templateUrl: './scenario-edit.html',
    imports: [FormsModule, Select, Checkbox],
    styleUrls: ['./scenario-edit.scss']
})
export class ScenarioEdit {
    scenarioId!: number;

    scenario: Scenario = {
        id: 1,
        title: 'Бюджетное IT-обучение',
        goal: 'Бюджет',
        region: 'Душанбе',
        fields: ['Информационные технологии'],
        constraints: {
            budgetOnly: true,
            language: 'Русский'
        },
        status: 'draft'
    };

    goals = ['Бюджет', 'Престиж', 'Трудоустройство'];
    regions = ['Душанбе', 'Худжанд', 'Таджикистан', 'СНГ'];
    fieldsList = ['Информационные технологии', 'Экономика', 'Медицина', 'Инженерия', 'Юриспруденция'];
    languages = ['Русский', 'Таджикский', 'Английский'];

    constructor(private route: ActivatedRoute) {
        this.scenarioId = Number(this.route.snapshot.paramMap.get('id'));
    }

    save() {
        console.log('SCENARIO UPDATED (mock):', this.scenario);
        alert('Сценарий обновлён (mock)');
    }

    complete() {
        this.scenario.status = 'completed';
        alert('Сценарий помечен как завершён (mock)');
    }
}
