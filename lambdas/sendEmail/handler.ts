import 'source-map-support/register';
import * as AWS from 'aws-sdk';

import { middyfy } from '../common/middyfy';

interface email {
    to: string;
    subject: string;
    htmlBody: string;
    textBody: string;
}

const ses = new AWS.SES();
const { EMAIL_SENDER_ADDRESS } = process.env;

const emailSend = async (event) => {
    console.log(event)
    const result = await sendEmail(event.email);
    return result;
};

const sendEmail = (email: email) => {
    const params = {
        Destination: {
            ToAddresses: [ email.to ],
        },
        Message: {
            Subject: {
                Data: email.subject,
            },
            Body: {
                Html: {
                    Data: email.htmlBody || email.textBody,
                },
                Text: {
                    Data: email.textBody || email.htmlBody,
                },
            },
        },
        Source: EMAIL_SENDER_ADDRESS,
    };
    return ses.sendEmail(params).promise();
}

export const main = middyfy(emailSend);