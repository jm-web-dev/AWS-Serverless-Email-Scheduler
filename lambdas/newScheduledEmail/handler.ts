import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import Responses from '../common/apiResponses';
import { middyfy } from '../common/middyfy';

const stepfunctions = new AWS.StepFunctions();

const newScheduledEmail = async event => {
    console.log('event', event);

    if (!event.body || !event.body.sendStatus || !event.body.to || !event.body.dueDate || !(event.body.textBody || event.body.htmlBody) || !event.body.subject) {
        return Responses._400({ message: 'Missing a required variable in request' });
    }

    //create scheduled task
   const stateMachineArn = process.env.STATEMACHINE_ARN;
    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify(event.body),
    }).promise();
   
    return Responses._200({ result });
};

export const main = middyfy(newScheduledEmail);