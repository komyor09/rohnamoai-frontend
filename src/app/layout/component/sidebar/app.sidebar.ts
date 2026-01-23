import { Component, ElementRef } from '@angular/core';
import { AppMenu } from '@/layout/component/menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, AppMenu],
    templateUrl: 'app.sidebar.html'
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
