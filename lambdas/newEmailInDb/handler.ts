import 'source-map-support/register';
import Responses from '../common/apiResponses';
import DB from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.TABLE_NAME;

const newEmailInDb = async event => {
    console.log('event', event);

    const newEmail = await DB.write(event.body, tableName).catch(err => {
        console.log('error in DB write', err);
        return null;
    });

    if (!newEmail) {
        return Responses._400({ message: 'Failed to write user by ID' });
    }

    return Responses._200({ newEmail });
};

export const main = middyfy(newEmailInDb);