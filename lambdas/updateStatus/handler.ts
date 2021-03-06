import 'source-map-support/register';
import Dynamo from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.TABLE_NAME;

const cancelEmailUpdateDb = async (event, _, callback) => {
    console.log(event)
    if(event.result.MessageId && event.result.MessageId !== '' && event.ID) {
        const ID = event.ID;
        await Dynamo.update( tableName, 'ID', ID, 'sendStatus', 'SENT');        
        callback(null, { ID });
    }

    if(event.result.stopDate && event.result.stopDate !== '' && event.ID) {
        const ID = event.ID;
        await Dynamo.update( tableName, 'ID', ID, 'sendStatus', 'CANCELLED');        
        callback(null, { ID });
    }

    callback(null, { message: 'Something went wrong updating the table' })
};

export const main = middyfy(cancelEmailUpdateDb);