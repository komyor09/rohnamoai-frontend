import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-support',
    imports: [FormsModule, Button, InputText, TextareaModule, NgIf],
    templateUrl: './support.html',
    styleUrls: ['./support.scss']
})
export class SupportComponent {
    private layoutService = inject(LayoutService);

    form = { subject: '', message: '' };
    submitted = false;
    sending = false;

    constructor() {
        this.layoutService.setTitlePage('Поддержка');
    }

    send(): void {
        if (!this.form.subject.trim() || !this.form.message.trim()) return;
        this.sending = true;
        // Simulate send (no backend endpoint for support)
        setTimeout(() => {
            this.sending = false;
            this.submitted = true;
            this.form = { subject: '', message: '' };
        }, 800);
    }
}
