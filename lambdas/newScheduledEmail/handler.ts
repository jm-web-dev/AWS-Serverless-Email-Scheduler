import 'source-map-support/register';

import Responses from '../common/apiResponses';
import { middyfy } from '../common/middyfy';

const newScheduledEmail = async event => {
    console.log('event', event);

    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._400({ message: 'missing the ID from the path' });
    }

    // get all vars
    let ID = event.pathParameters.ID;
    const user = JSON.parse(event.body);
    user.ID = ID;

    //create scheduled task

    

   
    return Responses._200({  });
};

export const main = middyfy(newScheduledEmail);