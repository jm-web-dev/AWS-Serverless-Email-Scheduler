import 'source-map-support/register';

import Responses from '../common/apiResponses';
import DB from '../common/Dynamo';

import { middyfy } from '../common/middyfy';

const tableName = process.env.tableName;

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

    //add new email to DB
    const newUser = await DB.write(user, tableName).catch(err => {
        console.log('error in DB write', err);
        return null;
    });

    if (!newUser) {
        return Responses._400({ message: 'Failed to write user by ID' });
    }

    return Responses._200({ newUser });
};

export const main = middyfy(newScheduledEmail);