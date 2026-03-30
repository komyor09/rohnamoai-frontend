import { Routes } from '@angular/router';

export default [
    {
        path: 'home',
        loadComponent: (): Promise<unknown> => import('./home/home').then((m) => m.Home)
    },
    {
        path: 'profile',
        loadComponent: (): Promise<unknown> => import('./profile/profile').then((m) => m.Profile)
    },
    {
        path: 'new-scenario',
        loadComponent: (): Promise<unknown> => import('./new-scenario/new-scenario').then((m) => m.NewScenario)
    },
    {
        path: 'scenario-edit/:id',
        loadComponent: (): Promise<unknown> => import('./scenario-edit/scenario-edit').then((m) => m.ScenarioEdit)
    },
    {
        path: 'scenario-results/:id',
        loadComponent: (): Promise<unknown> => import('./scenario-results/scenario-results').then((m) => m.ScenarioResults)
    },
    {
        path: 'specialty-details/:institution/:specialty',
        loadComponent: (): Promise<unknown> => import('./specialty-details/specialty-details').then((m) => m.SpecialtyDetails)
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
        path: 'pricing',
        loadComponent: (): Promise<unknown> => import('./pricing/pricing').then((m) => m.Pricing)
    },
    {
        path: 'support',
        loadComponent: (): Promise<unknown> => import('./support/support').then((m) => m.Support)
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
