import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import { middyfy } from '../common/middyfy';

const stepfunctions = new AWS.StepFunctions();

//TODO: add cancel to email DB
const cancelEmail = async (event) => {
    const requestData = JSON.parse(event.body);
    const jobARN = requestData.input.arn.cancelARN;
    var params = {
        executionArn: jobARN,
        cause: 'Booking Cancellation'
    };
    const result = await stepfunctions.stopExecution(params).promise();
    return result;
};

export const main = middyfy(cancelEmail);