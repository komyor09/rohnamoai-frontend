import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScenariosService } from '@/core/services/scenarios.service';
import { UserIdentityService } from '@/core/services/user-identity.service';
import { Scenario } from '@/core/models';

@Component({
    selector: 'app-profile',
    imports: [FormsModule, RouterLink],
    templateUrl: './profile.html'
})
export class Profile implements OnInit {
    private scenariosService = inject(ScenariosService);
    private identity = inject(UserIdentityService);

    uuid = this.identity.uuid;
    scenarios: Scenario[] = [];
    loading = true;

    get completedCount() { return this.scenarios.filter(s => s.status === 'completed').length; }
    get draftCount() { return this.scenarios.filter(s => s.status === 'draft').length; }

    goalLabel(goal: string): string {
        const map: Record<string, string> = { budget: 'Бюджет', prestige: 'Престиж', job: 'Трудоустройство', location: 'Локация' };
        return map[goal] ?? goal;
    }

    ngOnInit(): void {
        this.scenariosService.list().subscribe({
            next: (data) => { this.scenarios = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    copyUuid(): void {
        navigator.clipboard.writeText(this.uuid).catch(() => {});
    }
}
