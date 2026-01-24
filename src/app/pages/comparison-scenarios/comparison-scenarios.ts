import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

interface ComparedScenario {
    id: number;
    title: string;
    goal: string;
    region: string;
    resultsCount: number;
    matchRate: number;
    budgetOnly: boolean;
    language: string;
}

@Component({
    selector: 'app-comparison-scenarios',
    templateUrl: './comparison-scenarios.html',
    styleUrls: ['./comparison-scenarios.scss']
})
export class ComparisonScenarios {
    private layoutService = inject(LayoutService);

    scenarios: ComparedScenario[] = [
        {
            id: 1,
            title: 'Бюджетное IT-обучение',
            goal: 'Бюджет',
            region: 'Душанбе',
            resultsCount: 6,
            matchRate: 84,
            budgetOnly: true,
            language: 'Русский'
        },
        {
            id: 2,
            title: 'Престижное образование',
            goal: 'Престиж',
            region: 'СНГ',
            resultsCount: 9,
            matchRate: 78,
            budgetOnly: false,
            language: 'Английский'
        }
    ];
    constructor() {
        this.layoutService.setTitlePage('Сравнение сценарий');
    }
}
