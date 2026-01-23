import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '@/layout/component/menuitem/app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, AppMenuitem],
    templateUrl: 'app.menu.html'
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Страницы',
                items: [
                    { label: 'Главная', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    {
                        label: 'Сценарии',
                        icon: 'pi pi-fw pi-home',
                        items: [
                            { label: 'Создать', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/pages/new-scenario'] },
                            { label: 'Мои сценарии', icon: 'pi pi-fw pi-play-circle', routerLink: ['/pages/scenarios'] },
                            { label: 'Сравнение сценарий', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/comparison-scenarios'] }
                        ]
                    },
                    {
                        label: 'Поддержка',
                        icon: 'pi pi-fw pi-telegram',
                        url: 'https://t.me/komyor_06',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
