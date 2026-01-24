import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

interface ResultItem {
    id: number;
    title: string;
    university: string;
    match: number;
    reason: string;
}

@Component({
    selector: 'app-scenario-results',
    imports: [Button, RouterLink],
    templateUrl: './scenario-results.html'
})
export class ScenarioResultsComponent {
    scenarioTitle = 'Бюджетное IT-обучение';
    status: 'completed' | 'draft' = 'completed';

    summary = {
        total: 12,
        avgMatch: 78,
        keyFactor: 'Бюджет + регион'
    };

    results: ResultItem[] = [
        {
            id: 1,
            title: 'Информационные технологии',
            university: 'Таджикский технический университет',
            match: 82,
            reason: 'Подходит по бюджету и региону'
        },
        {
            id: 2,
            title: 'Программная инженерия',
            university: 'Таджикский национальный университет',
            match: 75,
            reason: 'Соответствует выбранному языку обучения'
        },
        {
            id: 3,
            title: 'Компьютерные науки',
            university: 'Международный университет',
            match: 70,
            reason: 'Минимальные ограничения по баллам'
        }
    ];
}
