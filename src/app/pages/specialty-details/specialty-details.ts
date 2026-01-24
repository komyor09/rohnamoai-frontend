import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-specialty-details',
    imports: [Button, RouterLink],
    templateUrl: './specialty-details.html'
})
export class SpecialtyDetailsComponent {
    specialty = {
        id: 1,
        title: 'Информационные технологии',
        university: 'Таджикский технический университет',
        match: 82,
        budget: true,
        region: 'Душанбе',
        language: 'Русский',
        competition: 'Высокая',
        description: 'Специальность ориентирована на подготовку специалистов в области разработки программного обеспечения, информационных систем и баз данных.'
    };

    pros = ['Соответствует выбранной цели поступления', 'Есть бюджетные места', 'Подходящий регион обучения', 'Востребованность на рынке труда'];

    cons = ['Высокая конкуренция при поступлении', 'Требуются хорошие знания математики', 'Интенсивная учебная нагрузка'];
}
