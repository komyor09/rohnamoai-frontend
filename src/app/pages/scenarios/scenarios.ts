import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-scenarios',
    imports: [],
    templateUrl: './scenarios.html',
    styleUrl: './scenarios.scss'
})
export class Scenarios {
    private layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.setTitlePage('Мои сценарии');
    }
}
