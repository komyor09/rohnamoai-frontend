import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-feature-access',
    templateUrl: './feature-access.html',
    styleUrls: ['./feature-access.scss']
})
export class FeatureAccess {
    @Input() featureTitle!: string;
    @Input() description!: string;

    @Input() requiredTokens = 0;
    @Input() userTokens = 0;

    @Output() confirm = new EventEmitter<void>();
    @Output() upgrade = new EventEmitter<void>();

    get hasEnoughTokens(): boolean {
        return this.userTokens >= this.requiredTokens;
    }
}
