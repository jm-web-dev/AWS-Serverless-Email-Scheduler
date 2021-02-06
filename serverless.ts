import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'aws-typescript-api',
        // app and org for use with dashboard.serverless.com
        // app: your-app-name,
        // org: your-org-name,
    },
    frameworkVersion: '>=1.72.0',
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
        }
    },
    plugins: [
        'serverless-webpack', 
        'serverless-offline',
        'serverless-dynamodb-local'
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
        // environment: {
        //     AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        // },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:*'
                ],
                Resource: '*',
            },
        ],
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
        }
    },
    functions: {
        getCityInfo: {
            handler: 'lambdas/getCityInfo.handler',
            events: [
                {
                    http: {
                        path: 'get-city/{city}',
                        method: 'get',
                        cors: true,
                    },
                },
            ],
        },
    },
};

module.exports = serverlessConfiguration;