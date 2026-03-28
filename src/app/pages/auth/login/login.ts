import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { AuthService } from '@/core/services/auth.service';
import { Card } from 'primeng/card';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterLink, InputText, Button, Password, Card, InputGroup, InputGroupAddon],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    loading = signal(false);
    errorMsg = signal('');

    submit(): void {
        this.errorMsg.set('');
        if (!this.email.trim() || !this.password) {
            this.errorMsg.set('Введите email и пароль');
            return;
        }
        this.loading.set(true);
        this.authService.login({ email: this.email.trim(), password: this.password }).subscribe({
            next: (res) => {
                this.loading.set(false);
                if (res.success && res.data) {
                    this.router.navigate(['/pages/home']);
                } else {
                    this.errorMsg.set('Ошибка входа');
                }
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMsg.set(err?.error?.detail ?? 'Неверный email или пароль');
            }
        });
    }
}
