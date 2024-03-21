const client = require('./jest/client');
const {axios, root} = client;

test("Test Liveness", async () => {
    const request = await axios.get(root + '/healthz/liveness');
    const expectedResult = {data: {status: 'ok'}};
    expect(request.data).toEqual(expectedResult);
});

test("Test Readiness", async () => {
    const request = await axios.get(root + '/healthz/readiness');
    const expectedResult = {data: {status: 'ok'}};
    expect(request.data).toEqual(expectedResult);
});
