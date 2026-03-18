import { Injectable } from '@angular/core';

const USER_UUID_KEY = 'rohnamo_user_uuid';

function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

@Injectable({ providedIn: 'root' })
export class UserIdentityService {
    private _uuid: string;

    constructor() {
        const stored = localStorage.getItem(USER_UUID_KEY);
        if (stored) {
            this._uuid = stored;
        } else {
            this._uuid = generateUUID();
            localStorage.setItem(USER_UUID_KEY, this._uuid);
        }
    }

    get uuid(): string {
        return this._uuid;
    }
}
