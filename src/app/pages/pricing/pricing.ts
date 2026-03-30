import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { UserIdentityService } from '@/core/services/user-identity.service';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.html',
    styleUrls: ['./pricing.scss']
})
export class Pricing {
    private layoutService = inject(LayoutService);
    identity = inject(UserIdentityService);

    currentPlan: 'free' | 'pro' = 'free';

    constructor() {
        this.layoutService.setTitlePage('');
    }

    plans = [
        {
            id: 'free',
            name: 'Бесплатный',
            price: '0',
            currency: 'сом/мес',
            features: ['До 3 сценариев', 'Базовый поиск специальностей', 'Просмотр результатов'],
            limitations: ['Без AI-объяснений', 'Без сравнения сценариев'],
            cta: 'Текущий план',
            disabled: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '99',
            currency: 'сом/мес',
            features: ['До 10 сценариев', 'AI-объяснения результатов', 'Матрица решений', 'Приоритетный поиск', 'Экспорт в PDF'],
            limitations: [],
            cta: 'Перейти на Pro',
            disabled: false
        }
    ];
}
