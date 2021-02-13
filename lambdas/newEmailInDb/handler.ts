import 'source-map-support/register';
import { v4 as uuid } from 'uuid';

import DB from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.TABLE_NAME;

const newEmailInDb = async (event, _, callback) => {
    console.log('event: ', event)

    const { sendStatus, to, dueDate, subject, textBody, htmlBody } = event.Payload.Input;
    const { Execution } = event;
    const params  = {
        ID: uuid(),
        sendStatus, 
        to, 
        subject, 
        textBody, 
        htmlBody,
        jobId: Execution
    }

    const newEmail = await DB.write(params, tableName).catch(err => {
        console.log('error in DB write', err);
        return null;
    });

    if (!newEmail) {
        return { message: 'Failed to write email to DB' };
    }

    callback(null, { newEmail, dueDate });
};

export const main = middyfy(newEmailInDb);