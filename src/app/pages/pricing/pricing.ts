import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-pricing',
    imports: [Button],
    templateUrl: './pricing.html'
})
export class Pricing {
    userTokens = 3;

    plans = [
        {
            name: 'Бесплатный',
            price: '0',
            description: 'Для первого знакомства с сервисом',
            features: ['До 2 сценариев', 'Базовые результаты', 'Ограниченные объяснения']
        },
        {
            name: 'Стандарт',
            price: '49 сомони',
            description: 'Для осознанного выбора',
            features: ['До 10 сценариев', 'Сравнение сценариев', 'Расширенные объяснения', 'История изменений'],
            popular: true
        },
        {
            name: 'Премиум',
            price: '99 сомони',
            description: 'Максимальная ясность и контроль',
            features: ['Неограниченные сценарии', 'Все объяснения', 'Аналитика и рекомендации', 'Приоритетная поддержка']
        }
    ];

    tokenActions = [
        { action: 'Сравнение сценариев', cost: 5 },
        { action: 'Расширенное объяснение результатов', cost: 3 },
        { action: 'Аналитика и рекомендации', cost: 4 }
    ];
}
