import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-home',
    imports: [TableModule, Button],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {
    private layoutService = inject(LayoutService);
    private username = 'Комёр';

    constructor() {
        this.layoutService.setTitlePage('Добро пожаловать, ' + this.username + '!');
        this.layoutService.setTransparentBackground(true);
    }

    ngOnDestroy(): void {
        this.layoutService.setTransparentBackground(false);
    }
}
