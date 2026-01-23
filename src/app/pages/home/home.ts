import { Component, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {
    private layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.setTitlePage('');
        this.layoutService.setTransparentBackground(true);
    }

    ngOnDestroy(): void {
        this.layoutService.setTransparentBackground(false);
    }
}
