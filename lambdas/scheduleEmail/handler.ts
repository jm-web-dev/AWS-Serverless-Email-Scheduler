import 'source-map-support/register';
import * as AWS from 'aws-sdk';

import { middyfy } from '../common/middyfy';

const stepfunctions = new AWS.StepFunctions();

const scheduleEmail = async (event) => {
    console.log(event);
    const stateMachineArn = process.env.STATEMACHINE_ARN;
    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify(event),
    }).promise();
    return result;
};

export const main = middyfy(scheduleEmail);