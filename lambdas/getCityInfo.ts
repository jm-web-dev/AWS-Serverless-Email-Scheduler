import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const city = event.pathParameters?.city;

    if (!city || !cityData[city]) {
        return apiResponses._400({ message: 'missing city or no data for that city' });
    }

    return apiResponses._200(cityData[city]);
};

const apiResponses = {
    _200: (body: { [key: string]: any }) => {
        return {
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _400: (body: { [key: string]: any }) => {
        return {
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
};

interface CityData {
    name: string;
    state: string;
    description: string;
    mayor: string;
    population: number;
    zipCodes?: string;
}

const cityData: { [key: string]: CityData } = {
    seattle: {
        name: 'Seattle',
        state: 'Washington',
        description: `DescriptionSeattle, a city on Puget Sound in the Pacific Northwest, is surrounded by water, mountains and evergreen forests, and contains thousands of acres of parkland. Washington State’s largest city, it’s home to a large tech industry, with Microsoft and Amazon headquartered in its metropolitan area. The futuristic Space Needle, a 1962 World’s Fair legacy, is its most iconic landmark.`,
        mayor: 'Jenny Durkan',
        population: 744955,
    },
};
