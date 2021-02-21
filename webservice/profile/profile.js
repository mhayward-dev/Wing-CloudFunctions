const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.add = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    const user = {
        id: data.id,
        email: data.email,
        updatedAt: timestamp,
        createdAt: timestamp
    };

    putUser(user).then(() => {
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

function putUser(user) {
    return dynamoDb.put({
        TableName: 'Users-' + process.env.STAGE,
        Item: user
    }).promise();
}