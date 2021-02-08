import 'source-map-support/register';
import Responses from '../common/apiResponses';
import DB from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.tableName;

const sentEmailUpdateDb = async event => {
    let ID = event.pathParameters.ID;
    const { jobId } = event.body;

    await DB.update( tableName, 'ID', ID, 'jobId', jobId) ;

    return Responses._200({});
};

export const main = middyfy(sentEmailUpdateDb);