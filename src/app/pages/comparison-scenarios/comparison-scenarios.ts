import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-comparison-scenarios',
    imports: [],
    templateUrl: './comparison-scenarios.html',
    styleUrl: './comparison-scenarios.scss'
})
export class ComparisonScenarios {
    private layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.setTitlePage('Сравнение сценарий');
    }
}
