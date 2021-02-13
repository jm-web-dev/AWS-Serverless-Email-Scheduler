import { Serverless } from 'serverless/aws';
import { cancelEmail,
         newEmailInDb,
         newScheduledEmail,
         cancelScheduledEmail,
         sendEmail,
         updateStatus } from './lambdas';

interface stepFunctions {
    stateMachines: any;
}

type ServerlessPlus = Serverless & { stepFunctions: stepFunctions };

const serverlessConfiguration: ServerlessPlus = {
    service: 'EmailScheduler',
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
        //TODO: generic IAM user
        //https://www.serverless.com/framework/docs/providers/aws/guide/credentials/
        profile: 'serverless',
        region: 'ap-southeast-1',
        apiGateway: {
            minimumCompressionSize: 0,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            TABLE_NAME: 'emails',
            STATEMACHINE_ARN: '${self:resources.Outputs.ScheduleEmailStateMachine.Value}',
            CANCEL_STATEMACHINE_ARN: '${self:resources.Outputs.CancelEmailStateMachine.Value}',
            //TODO: another email
            //https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html
            EMAIL_SENDER_ADDRESS: 'anhtieng89@gmail.com'
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['ssm:GetParameters*'],
                Resource: {
                    'Fn::Sub':'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/*'
                }
            },
            {
                Effect: 'Allow',
                Action: [ 'dynamodb:PutItem', 'dynamodb:UpdateItem' ],
                Resource: { 'Fn::GetAtt' : [ 'Emails', 'Arn' ] }
            },
            {
                Effect: 'Allow',
                Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
                Resource: { 'Fn::Sub': [ 'arn:aws:ses:${AWS::Region}:${AWS::AccountId}:identity/${ADDRESS}', { 'ADDRESS': '${self:provider.environment.EMAIL_SENDER_ADDRESS}'} ]}
             },
            {
                Effect: 'Allow',
                Action: [ 'states:StartExecution' ],       
                Resource: [ { 'Ref' : 'CancelEmailStateMachine' }, { 'Ref' : 'ScheduleEmailStateMachine' } ]
            },
            {
                Effect: 'Allow',
                Action: [ 'states:StopExecution' ],       
                Resource: '*'      
            }
        ]
    },
    functions: { cancelEmail,
                 newEmailInDb,
                 newScheduledEmail,
                 cancelScheduledEmail,
                 sendEmail,
                 updateStatus },
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
                            Resource: {
                                'Fn::Sub': 'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:newEmailInDb'
                            },
                            Parameters: {
                                'Execution.$': '$$.Execution.Id',
                                Payload: {
                                    'Input.$': '$'
                                }
                            },
                            Next: 'WaitForDueDate'
                        },
                        WaitForDueDate: {
                            Type: 'Wait',
                            TimestampPath: '$.dueDate',
                            Next: 'SendEmail'
                        },
                        SendEmail: {
                            Type: 'Task',
                            Resource: {
                                'Fn::Sub': 'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:sendEmail'
                            },
                            Next: 'UpdateEmailInDb'
                        },
                        UpdateEmailInDb: {
                            Type: 'Task',
                            Resource: {
                                'Fn::Sub': 'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:updateStatus'
                            },
                            End: true
                        }
                    }
                }
            },
            CancelEmailStateMachine: {
                name: 'CancelEmailStateMachine',
                definition: {   
                    Comment: 'Cancel a scheduled Email',                     
                    StartAt: 'CancelScheduledEmail',
                    States: {
                        CancelScheduledEmail: {
                            Type: 'Task',
                            Resource: {
                                'Fn::Sub': 'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:cancelEmail'
                            },
                            Next: 'UpdateDbCancelledEmail'
                        },
                        UpdateDbCancelledEmail: {
                            Type: 'Task',
                            Resource: {
                                'Fn::Sub': 'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:updateStatus'
                            },
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
            },
            CancelEmailStateMachine: {
                Description: 'The ARN of the CancelEmailStateMachine',
                Value: {
                    'Ref': 'CancelEmailStateMachine'
                }
            },
        }
    }
};

module.exports = serverlessConfiguration;