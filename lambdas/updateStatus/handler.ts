import 'source-map-support/register';
import Responses from '../common/apiResponses';
import Dynamo from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.tableName;

const cancelEmailUpdateDb = async event => {
    console.log(event)
    let ID = event.ID;
    const { sendStatus } = event.body;

    await Dynamo.update( tableName, 'ID', ID, 'sendStatus', sendStatus) ;

    return Responses._200({});
};

export const main = middyfy(cancelEmailUpdateDb);