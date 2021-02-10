import 'source-map-support/register';
import DB from '../common/Dynamo';
import { middyfy } from '../common/middyfy';

const tableName = process.env.tableName;

const sentEmailUpdateDb = async (event, context, callback) => {
    console.log(context)
    const { ID } = event.newEmail;
    const jobId = context.Execution.ID;

    await DB.update( tableName, 'ID', ID, 'jobId', jobId) ;

    return callback()
};

export const main = middyfy(sentEmailUpdateDb);