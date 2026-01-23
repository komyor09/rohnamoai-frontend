import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

interface ScenarioDraft {
    goal: string | null;
    region: string | null;
    fields: string[];
    constraints: {
        budgetOnly: boolean;
        language: string | null;
    };
}

@Component({
    selector: 'app-new-scenario',
    templateUrl: './new-scenario.html',
    imports: [Select, Checkbox, FormsModule, SelectButton],
    styleUrls: ['./new-scenario.scss']
})
export class NewScenarioComponent {
    private layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.setTitlePage('Новая сценария');
    }

    step = 0;

    scenario: ScenarioDraft = {
        goal: null,
        region: null,
        fields: [],
        constraints: {
            budgetOnly: false,
            language: null
        }
    };

    // ---- MOCK DATA ----

    goals = [
        { label: 'Бюджетное обучение', value: 'budget' },
        { label: 'Престижный диплом', value: 'prestige' },
        { label: 'Быстрое трудоустройство', value: 'job' }
    ];

    regions = ['Душанбе', 'Худжанд', 'Таджикистан', 'СНГ'];

    fields = ['Информационные технологии', 'Экономика', 'Медицина', 'Инженерия', 'Юриспруденция'];

    languages = ['Русский', 'Таджикский', 'Английский'];

    // ---- STEP CONTROL ----

    next() {
        if (this.step < 3) this.step++;
    }

    back() {
        if (this.step > 0) this.step--;
    }

    submit() {
        console.log('SCENARIO CREATED (mock):', this.scenario);
        alert('Сценарий создан (mock)');
    }
}
