import Responses from './APIResponses';

it('Responses is an object', () => {
    expect(typeof Responses).toBe('object');
})

it('_200 works', () => {
    const res = Responses._200({ name: 'test' });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

it('_400 works', () => {
    const res = Responses._400({ name: 'test' });
    expect(res.statusCode).toBe(400);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

it('204 works', () => {
    const res = Responses._204({ name: 'test' });
    expect(res.statusCode).toBe(204);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

it('define response', () => {
    const res = Responses._DefineResponse(111, { some: 'thing' });
    expect(res.statusCode).toBe(111);
    expect(res.body).toBe(JSON.stringify({ some: 'thing' }));
    expect(res.headers['Content-Type']).toBe('application/json');
})