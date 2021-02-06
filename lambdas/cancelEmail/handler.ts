import * as AWS from 'aws-sdk';

const stepfunctions = new AWS.StepFunctions();

const handler = async (event) => {
    const requestData = JSON.parse(event.body);
    const jobARN = requestData.input.arn.cancelARN;
    var params = {
        executionArn: jobARN,
        cause: 'Booking Cancellation'
    };
    const result = await stepfunctions.stopExecution(params).promise();
    return result;
};

export default handler;