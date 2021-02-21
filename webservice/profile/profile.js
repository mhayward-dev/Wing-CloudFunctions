const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.add = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    const profile = {
        id: uuid.v1(),
        userId: data.id,
        email: data.email,
        updatedAt: timestamp,
        createdAt: timestamp
    };

    putProfile(profile).then(() => {
        callback(null, {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
        }).catch((err) => {
            console.error(err);
            errorResponse(err.message, context.awsRequestId, callback)
        });
    });
}

module.exports.update = (event, context, callback) => callback(null, {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
        message: 'This method is still todo!',
    }),
});

function putProfile(profile) {
    return dynamoDb.put({
        TableName: 'Profiles-' + process.env.STAGE,
        Item: profile
    }).promise();
}