import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
  selector: 'app-new-scenario',
  imports: [],
  templateUrl: './new-scenario.html',
  styleUrl: './new-scenario.scss'
})
export class NewScenario {
    private layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.setTitlePage('Новая сценария');
    }
}
