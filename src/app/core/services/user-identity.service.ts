import { computed, signal } from '@angular/core';

const USER_UUID_KEY = 'rohnamo_user_uuid';
const USER_PLAN_KEY = 'user_plan';

function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export class UserIdentityService {
    private _uuid = signal<string>('');
    private _plan = signal<'free' | 'pro'>('free');

    constructor() {
        // UUID
        const storedUuid = localStorage.getItem(USER_UUID_KEY);
        if (storedUuid) {
            this._uuid.set(storedUuid);
        } else {
            const newUuid = generateUUID();
            localStorage.setItem(USER_UUID_KEY, newUuid);
            this._uuid.set(newUuid);
        }

        // PLAN
        const storedPlan = localStorage.getItem(USER_PLAN_KEY) as 'free' | 'pro' | null;
        if (storedPlan) {
            this._plan.set(storedPlan);
        }
    }

    // ─── Public API ─────────────────────────

    uuid = computed(() => this._uuid());

    plan = computed(() => this._plan());

    isPro = computed(() => this._plan() === 'pro');

    // ─── Actions ─────────────────────────

    setPlan(plan: 'free' | 'pro') {
        this._plan.set(plan);
        localStorage.setItem(USER_PLAN_KEY, plan);
    }

    reset() {
        const newUuid = generateUUID();
        this._uuid.set(newUuid);
        this._plan.set('free');

        localStorage.setItem(USER_UUID_KEY, newUuid);
        localStorage.setItem(USER_PLAN_KEY, 'free');
    }
}
