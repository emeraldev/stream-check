const { DynamoDB } = require("aws-sdk")
const db = new DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://ddb_local:8000",
});
const { uuid } = require('uuidv4');
const TableName = process.env.TABLE_NAME

let body = {}

exports.setStream = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);
        const stream = {
            streamId: uuid(),
            userId: requestBody.userId,
        }

        await db
            .put({
                TableName,
                Item: stream,
            })
            .promise()

        body = stream;
        return {
            'statusCode': 200,
            'body': JSON.stringify(body)
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return {
        'statusCode': 200,
        'body': JSON.stringify(body)
    };
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
        console.log(TableName);
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
