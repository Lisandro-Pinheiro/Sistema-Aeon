import { Calendar, EventModel } from '../../build/calendar.module.js?476744';
import shared from '../_shared/shared.module.js?476744';

// Making a custom EventModel to enable resourceIds field usage
class CustomEventModel extends EventModel {
    static $name  = 'CustomEventModel';
    static fields = [
        { name : 'resourceIds', persist : true }
    ];
}

new Calendar({
    // Start life looking at this date
    date : new Date(2024, 4, 5),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            // Passing custom EventModel class to use resourceIds field
            modelClass : CustomEventModel
        },
        // The data set has multi assigned events using resourceIds
        loadUrl  : 'data/data.json',
        autoLoad : true
    },

    appendTo : 'container',

    // Where the avatar rendering utility finds the resource images
    resourceImagePath : '../_shared/images/users/',

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    },

    // When rendering needs a resource to get a colour and style from, ensure
    // we use the first resource that is still filtered in.
    filterEventResources : true,

    modes : {
        week : {
            // Show avatars in last position
            showResourceAvatars : 'last'
        }
    }
});
