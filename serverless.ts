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
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        profile: 'serverlessUser',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['translate:*'],
                Resource: '*',
            },
        ],
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
        translate: {
            handler: 'lambdas/translate.handler',
            events: [
                {
                    http: {
                        path: 'translate',
                        method: 'POST',
                        cors: true,
                    },
                },
            ],
        },
    },
};

module.exports = serverlessConfiguration;
