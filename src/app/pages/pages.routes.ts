import { Routes } from '@angular/router';

export default [
    {
        path: 'new-scenario',
        loadComponent: (): Promise<unknown> => import('./new-scenario/new-scenario').then((m) => m.NewScenarioComponent)
    },
    {
        path: 'scenarios',
        loadComponent: (): Promise<unknown> => import('./scenarios/scenarios').then((m) => m.Scenarios)
    },
    {
        path: 'comparison-scenarios',
        loadComponent: (): Promise<unknown> => import('./comparison-scenarios/comparison-scenarios').then((m) => m.ComparisonScenarios)
    },
    {
        path: 'home',
        loadComponent: (): Promise<unknown> => import('./home/home').then((m) => m.Home)
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
