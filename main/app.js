const { DynamoDB } = require("aws-sdk")
const db = new DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://ddb_local:8000",
});
const { uuid } = require('uuidv4');
const TableName = process.env.TABLE_NAME

let streams = [];
let statusCode = 200;
let errorMessage;

exports.setStream = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);

        if (!requestBody.streams) {
            statusCode = 400;
            errorMessage = "User not streaming";
        } else {
            if (requestBody.streams.length < 3) {
                /*await db
                    .put({
                        TableName,
                        Item: stream,
                    })
                    .promise()*/
                let watching = requestBody.streams;
                for (let stream in watching) {
                    streams.push({
                        streamId: uuid(),
                        userId: watching[stream].userId
                    });
                }
            } else {
                statusCode = 400;
                errorMessage = "Maximum limit reached, Unable to start a new stream.";
            }
        }

        return {
            statusCode: statusCode,
            body: JSON.stringify(streams),
            errorMessage: errorMessage,
        };

    } catch (err) {
        statusCode = (err.response && err.response.status) ? err.response.status : 500;
        console.log(err);
        errorMessage = err.message ? err.message : 'Internal Server Error';
    }
};

exports.removeStream = async (event, context) => {
    try {
        await db
            .delete({
                TableName,
                Key: {
                    userId: event.pathParameters.userId,
                },
            })
            .promise()

        return { statusCode: 200 }
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.getStream = async (event, context) => {
    try {
        const streams = await db
            .scan({
                TableName,
            })
            .promise()

        return { statusCode: 200, body: JSON.stringify(streams) }
    } catch (err) {
        console.log(err);
        return err;
    }
};
