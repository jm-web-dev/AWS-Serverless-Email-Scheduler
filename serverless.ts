import { Serverless } from 'serverless/aws';
import { cancelEmail,
         newEmailInDb,
         newScheduledEmail,
         scheduleEmail,
         sendEmail,
         updateARN,
         updateStatus } from './lambdas';

//TODO: better typing
interface stepFunctions {
    stateMachines: any;
}

type ServerlessPlus = Serverless & { stepFunctions: stepFunctions };

const serverlessConfiguration: ServerlessPlus = {
    service: {
        name: 'EmailScheduler',
        // app and org for use with dashboard.serverless.com
        // app: your-app-name,
        // org: your-org-name,
    },
    frameworkVersion: '>=1.72.0',
    package: {
        individually: true
    },
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
        dynamodb: {
            stages: [ 'dev', 'test' ],
            start: {
                port: 8000,
                inMemory: true,
                migrate: true
            },
            migration: {
                dir: 'offline/migrations'
            }
        },
        service: 'EmailScheduler'
    },
    plugins: [
        'serverless-webpack', 
        'serverless-offline',
        'serverless-dynamodb-local',
        'serverless-step-functions'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        //TODO: generic IAM user + region
        profile: 'serverless',
        region: 'ap-southeast-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            TABLE_NAME: 'emails',
            STATEMACHINE_ARN: '${self:resources.Outputs.ScheduleEmailStateMachine.Value}'
        },
        //TODO: more granular access
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [ 'dynamodb:*' ],
                Resource: '*'
            },
             {
                Effect: 'Allow',
                Action: [ 'states:StartExecution' ],
                Resource: [ { 'Ref': 'ScheduleEmailStateMachine' } ]
            }
        ]
    },
    functions: { cancelEmail,
                 newEmailInDb,
                 newScheduledEmail,
                 scheduleEmail,
                 sendEmail,
                 updateARN,
                 updateStatus },
    //TODO: resource arns properly
    stepFunctions: {
        stateMachines: {
            ScheduleEmailStateMachine: {
                name: 'ScheduleEmailStateMachine',
                definition: {
                    Comment: 'Schedules an email to be sent at a future date',
                    StartAt: 'InsertEmailIntoDb',
                    States: {
                        InsertEmailIntoDb: {
                            Type: 'Task',
                            Resource: 'arn:aws:lambda:ap-southeast-1:135209378380:function:newEmailInDb:1',
                            Next: 'WaitForDueDate'
                        },
                        WaitForDueDate: {
                            Type: 'Wait',
                            TimestampPath: '$.dueDate',
                            Next: 'SendEmail'
                        },
                        SendEmail: {
                            Type: 'Task',
                            Resource: 'arn:aws:lambda:ap-southeast-1:135209378380:function:sendEmail:1',
                            Next: 'UpdateEmailInDb'
                        },
                        UpdateEmailInDb: {
                            Type: 'Task',
                            Resource: 'arn:aws:lambda:ap-southeast-1:135209378380:function:updateStatus:1',
                            End: true
                        }
                    }
                }
            }
        }
    },
    resources: {
        Resources: {
            Emails: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    //TODO: tablename should be variable
                    TableName: 'emails',
                    AttributeDefinitions: [
                        { AttributeName: 'ID', AttributeType: 'S' }
                    ],
                    KeySchema: [
                        { AttributeName: 'ID', KeyType: 'HASH' }
                    ],
                    BillingMode: 'PAY_PER_REQUEST'
                }
            }
        },
        Outputs: {
            ScheduleEmailStateMachine: {
                Description: 'The ARN of the ScheduleEmailStateMachine',
                Value: {
                    'Ref': 'ScheduleEmailStateMachine'
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;