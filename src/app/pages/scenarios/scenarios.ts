import { LayoutService } from '@/layout/service/layout.service';
import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

type ScenarioStatus = 'draft' | 'completed';

interface Scenario {
    id: number;
    title: string;
    goal: string;
    region: string;
    status: ScenarioStatus;
    resultsCount: number;
    updatedAt: string;
}

@Component({
    selector: 'app-scenarios',
    templateUrl: './scenarios.html',
    imports: [NgClass],
    styleUrls: ['./scenarios.scss']
})
export class Scenarios {
    private layoutService = inject(LayoutService);

    scenarios: Scenario[] = [
        {
            id: 1,
            title: 'Бюджетное IT-обучение',
            goal: 'Бюджет',
            region: 'Душанбе',
            status: 'completed',
            resultsCount: 6,
            updatedAt: '2 дня назад'
        },
        {
            id: 2,
            title: 'Престижное образование',
            goal: 'Престиж',
            region: 'СНГ',
            status: 'draft',
            resultsCount: 0,
            updatedAt: 'вчера'
        },
        {
            id: 3,
            title: 'Работа за границей',
            goal: 'Трудоустройство',
            region: 'Европа',
            status: 'completed',
            resultsCount: 8,
            updatedAt: '5 дней назад'
        }
    ];

    constructor() {
        this.layoutService.setTitlePage('Мои сценарии');
    }
    getStatusLabel(status: ScenarioStatus): string {
        return status === 'completed' ? 'Завершён' : 'Черновик';
    }

    getStatusStyle(status: ScenarioStatus): string {
        return status === 'completed' ? 'bg-green-100 dark:bg-green-400/10 text-green-600' : 'bg-orange-100 dark:bg-orange-400/10 text-orange-600';
    }
}
