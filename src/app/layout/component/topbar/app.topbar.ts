import { Component, inject, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { AppConfigurator } from '@/layout/component/configuratior/app.configurator';
import { AuthService } from '@/core/services/auth.service';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Tag, Button],
    templateUrl: 'app.topbar.html'
})
export class AppTopbar {
    items!: MenuItem[];
    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    user = this.authService.user;
    userInitial = computed(() => {
        const email = this.user()?.email;
        return email ? email[0].toUpperCase() : '?';
    });

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout(): void {
        this.authService.logout();
    }
}
