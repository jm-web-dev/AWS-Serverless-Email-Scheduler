import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import Responses from '../common/apiResponses';
import { middyfy } from '../common/middyfy';

const stepfunctions = new AWS.StepFunctions();

const cancelScheduledEmail = async event => {
    console.log('event', event);

    if (!event.body || !event.body.jobId || !event.body.ID) {
        return Responses._400({ message: 'Missing a required variable in request' });
    }

   const stateMachineArn = process.env.CANCEL_STATEMACHINE_ARN;
    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify(event.body),
    }).promise();
   
    return Responses._200({ result });
};

export const main = middyfy(cancelScheduledEmail);