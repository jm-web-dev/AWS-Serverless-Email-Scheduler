import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import { middyfy } from '../common/middyfy';

const stepfunctions = new AWS.StepFunctions();

//TODO: check due date && deal with case where email sent and other rerrors
const cancelEmail = async (event, _, callback) => {
    console.log('event: ', event)

    const { jobId, ID } = event;

    var params = {
        executionArn: jobId,
        cause: 'Booking Cancellation'
    };
    const result = await stepfunctions.stopExecution(params).promise();
    return callback(null, { result, ID });
};

export const main = middyfy(cancelEmail);