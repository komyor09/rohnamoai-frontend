import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthUser, LoginRequest, RegisterRequest, AuthResponse, MeResponse } from '../models';

const ACCESS_TOKEN_KEY = 'rohnamo_access_token';
const REFRESH_TOKEN_KEY = 'rohnamo_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly baseUrl = 'http://localhost:8000';

    // ─── State ───────────────────────────────────────────────────────────
    private _user = signal<AuthUser | null>(null);

    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => this._user() !== null);
    readonly userPlan = computed(() => this._user()?.plan ?? 'free');

    constructor() {
        // On app start, if we have a token try to restore session
        if (this.getAccessToken()) {
            this.fetchMe().subscribe({
                error: () => this.clearTokens(),
            });
        }
    }

    // ─── Token helpers ───────────────────────────────────────────────────
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    private saveTokens(access: string, refresh: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }

    clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        this._user.set(null);
    }

    // ─── API calls ───────────────────────────────────────────────────────
    register(body: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, body).pipe(
            tap((res) => {
                if (res.success && res.data) {
                    this.saveTokens(res.data.access_token, res.data.refresh_token);
                    this.fetchMe().subscribe();
                }
            }),
        );
    }

    login(body: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login/json`, body).pipe(
            tap((res) => {
                if (res.success && res.data) {
                    this.saveTokens(res.data.access_token, res.data.refresh_token);
                    this.fetchMe().subscribe();
                }
            }),
        );
    }

    fetchMe(): Observable<MeResponse> {
        return this.http.get<MeResponse>(`${this.baseUrl}/auth/me`).pipe(
            tap((res) => {
                if (res.success && res.data) {
                    this._user.set(res.data);
                }
            }),
            catchError((err) => {
                if (err.status === 401) this.clearTokens();
                return throwError(() => err);
            }),
        );
    }

    refreshToken(): Observable<AuthResponse> {
        const token = this.getRefreshToken();
        if (!token) return throwError(() => new Error('No refresh token'));
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, { refresh_token: token }).pipe(
            tap((res) => {
                if (res.success && res.data) {
                    this.saveTokens(res.data.access_token, res.data.refresh_token);
                }
            }),
            catchError((err) => {
                this.clearTokens();
                this.router.navigate(['/auth/login']);
                return throwError(() => err);
            }),
        );
    }

    logout(): void {
        const token = this.getAccessToken();
        if (token) {
            this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe();
        }
        this.clearTokens();
        this.router.navigate(['/auth/login']);
    }
}
