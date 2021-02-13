import DB from '../common/Dynamo';

test('Dynamo is an object', () => {
    expect(typeof DB).toBe('object');
});

test('Dynamo has get, write and update', () => {
    expect(typeof DB.get).toBe('function');
    expect(typeof DB.write).toBe('function');
    expect(typeof DB.update).toBe('function');
});

const validTableName = 'emails';
//TODO: remove email
//https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html
const data = { ID: '3081042', sendStatus: 'INIT', to: 'anhtieng89@gmail.com', jobId: 'xxx' };
const updatedData = { ID: '3081042', sendStatus: 'SENT', to: 'anhtieng89@gmail.com', jobId: 'xxx' };

test('Dynamo write works', async () => {
    expect.assertions(1);
    try {
        const res = await DB.write(data, validTableName);
        expect(res).toBe(data);
    } catch (error) {
        console.log('error in dynamo write test', error);
    }
});

test('dynamo get works', async () => {
    expect.assertions(1);
    try {
        const res = await DB.get(data.ID, validTableName);
        expect(res).toEqual(data);
    } catch (error) {
        console.log('error in dynamo get', error);
    }
});

test('dynamo update works', async () => {
    expect.assertions(1);
    try {
        await DB.update(validTableName, 'ID', '3081042', 'sendStatus', 'SENT');
        const res = await DB.get(data.ID, validTableName);
        expect(res).toEqual(updatedData);
    } catch (error) {
        console.log('error in dynamo update: ', error);
    }
});