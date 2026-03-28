import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/layout/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { authGuard, guestGuard } from '@/core/guards/auth.guard';

export const appRoutes: Routes = [
    // ─── Auth pages (no layout, no guard) ────────────────────────────────
    {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./app/pages/auth/login/login').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./app/pages/auth/register/register').then((m) => m.RegisterComponent),
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
    },

    // ─── Protected app pages (with layout) ───────────────────────────────
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'pages',
                loadChildren: () => import('./app/pages/pages.routes'),
            },
        ],
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
