import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { AuthService } from '@/core/services/auth.service';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterLink, InputText, Button, Password],
    templateUrl: './register.html',
    styleUrls: ['./register.scss'],
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    passwordConfirm = '';
    loading = signal(false);
    errorMsg = signal('');

    submit(): void {
        this.errorMsg.set('');

        if (!this.email.trim() || !this.password) {
            this.errorMsg.set('Введите email и пароль');
            return;
        }
        if (this.password.length < 6) {
            this.errorMsg.set('Пароль должен содержать минимум 6 символов');
            return;
        }
        if (this.password !== this.passwordConfirm) {
            this.errorMsg.set('Пароли не совпадают');
            return;
        }

        this.loading.set(true);
        this.authService.register({ email: this.email.trim(), password: this.password }).subscribe({
            next: (res) => {
                this.loading.set(false);
                if (res.success) {
                    this.router.navigate(['/pages/home']);
                } else {
                    this.errorMsg.set(res.message ?? 'Ошибка регистрации');
                }
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMsg.set(err?.error?.detail ?? 'Ошибка регистрации');
            },
        });
    }
}
