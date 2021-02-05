import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: '@shelf/jest-dynamodb',
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};

process.env = Object.assign(process.env, { TableName: 'emails' });

export default config;