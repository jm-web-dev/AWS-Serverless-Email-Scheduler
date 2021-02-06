import * as AWS from 'aws-sdk';

const stepfunctions = new AWS.StepFunctions();

const handler = async (event) => {
    const stateMachineArn = process.env.STATEMACHINE_ARN;
    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: JSON.stringify(event),
    }).promise();
    return result;
};

export default handler;