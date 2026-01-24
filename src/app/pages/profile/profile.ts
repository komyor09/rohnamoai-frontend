import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    imports: [FormsModule, Button, RouterLink],
    templateUrl: './profile.html'
})
export class Profile {
    user = {
        id: 'anon-18472',
        tokens: 3,
        scenarioLimit: 5,
        scenariosUsed: 2
    };

    scenarios = [
        { id: 1, title: 'Бюджетное IT-обучение', status: 'completed' },
        { id: 2, title: 'Престижный вуз', status: 'draft' }
    ];

    settings = {
        darkMode: false,
        explanations: true
    };
}
