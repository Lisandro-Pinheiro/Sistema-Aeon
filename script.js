import { Calendar } from './build/calendar.module.js';
import shared from './_shared/shared.module.js';

const calendar = new Calendar({
    date: new Date(2021, 0, 1),
    crudManager: {
        transport: {
            load: {
                url: 'data/data.json'
            }
        },
        autoLoad: true
    },
    appendTo: 'container',
    resourceImagePath: './_shared/images/users/',
    features: {
        eventTooltip: {
            align: 'l-r'
        }
    },
    filterEventResources: true,
    modes: {
        week: {
            showResourceAvatars: 'last'
        }
    }
});
