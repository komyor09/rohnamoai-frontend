import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScenariosService } from '@/core/services/scenarios.service';
import { AuthService } from '@/core/services/auth.service';
import { Scenario } from '@/core/models';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-profile',
    imports: [RouterLink, Card, Button, Tag],
    templateUrl: './profile.html'
})
export class Profile implements OnInit {
    private layoutService = inject(LayoutService);
    private scenariosService = inject(ScenariosService);
    private authService = inject(AuthService);

    user = this.authService.user;
    plan = this.authService.userPlan;

    scenarios: Scenario[] = [];
    loading = true;

    constructor() {
        this.layoutService.setTitlePage('');
        this.layoutService.setTransparentBackground(true);
    }
    get completedCount(): number {
        return this.scenarios.filter((s) => s.status === 'completed').length;
    }

    get draftCount(): number {
        return this.scenarios.filter((s) => s.status === 'draft').length;
    }

    goalLabel(goal: string): string {
        const map: Record<string, string> = {
            budget: 'Бюджет',
            prestige: 'Престиж',
            job: 'Трудоустройство',
            location: 'Локация'
        };
        return map[goal] ?? goal;
    }

    statusLabel(status: string): string {
        return status === 'completed' ? 'Завершён' : 'Черновик';
    }

    statusIsCompleted(status: string): boolean {
        return status === 'completed';
    }

    ngOnInit(): void {
        this.scenariosService.list().subscribe({
            next: (data) => {
                this.scenarios = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    logout(): void {
        this.authService.logout();
    }

    protected openScenario(s: Scenario) {}
}
