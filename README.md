# Serverless Email Scheduler

This project is based on this email scheduler: https://serverlessfirst.com/serverless-email-scheduler/
I highly recommend reading that blog post.

It allows you to schedule an email to be sent at a future date of your choosing. It stores all scheduled emails in an Amazon DynamoDB table and you can cancel a scheduled email based on the ID and arn stored in the table.

The project uses 2 AWS step functions, one to schedule and send the emails at a certain time using the Wait task and one which cancels scheduled emails.

There are 2 API endpoints: /new-email and /cancel-email

The /new-email endpoint creates a new email scheduled job. You can POST to it with the following data:

```json
{  
	"sendStatus": "string of your choice that indicates that the email has been scheduled not sent eg. INIT",
	"to": "email address",
	"dueDate": "UTC time string eg. 2021-02-10T16:35:24.000Z",
	"subject": "email subject as string",
	"textBody": "text body as string",
	"htmlBody": "html input"

}
```

You must supply all of these with a valid email and date apart from textBody/htmlBody where you must supply at least one. 

This will create an execution in the email scheduling step function and an entry into your DynamoDB table. 

To cancel the execution POST to the /cancel-email endpoint with:

```json
{  
	"ID": "ID of item in DynamoDB table",
	"jobId": "ARN of execution (this is in the table)"
}
```



## Pre-requisites

You need an AWS account. Complete the following steps:

1. [Verify an email address in SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) from which emails will be sent from
2. [Configure your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
3. [Create an IAM user for serverless](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) 
4. Run `npm install` in the root folder
5. Open `serverless.ts` and modify the `EMAIL_SENDER_ADDRESS` setting to be the email address you verified in step 1. 
6. Set your `profile` to the user from step 3.
7. Set your region.
8. Deploy



## Questions

You can email me: jmwebdevelopment@protonmail.com

I will be updating this project with some validation and more testing soon. 
