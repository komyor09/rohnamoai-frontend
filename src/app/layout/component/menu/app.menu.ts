import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '@/layout/component/menuitem/app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: 'app.menu.html'
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Навигация',
                items: [
                    { label: 'Главная', icon: 'pi pi-fw pi-home', routerLink: ['/pages/home'] },
                    { label: 'Мои сценарии', icon: 'pi pi-fw pi-list', routerLink: ['/pages/scenarios'] },
                    { label: 'Создать сценарий', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/pages/new-scenario'] },
                    { label: 'Сравнение', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/comparison-scenarios'] },
                ]
            },
            {
                label: 'Аккаунт',
                items: [
                    { label: 'Профиль', icon: 'pi pi-fw pi-user', routerLink: ['/pages/profile'] },
                    { label: 'Тарифы', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/pricing'] },
                    { label: 'Поддержка', icon: 'pi pi-fw pi-comments', routerLink: ['/pages/support'] },
                ]
            }
        ];
    }
}
