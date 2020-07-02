/**
 * Route: Delete /note/t/{timestamp}
 */

const AWS = require('aws-sdk');
const {MethodResponse, getUser} = require('../helper');

AWS.config.update({region: 'sa-east-1'});


const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  return MethodResponse(async () => {
    const timestamp = parseInt(event.pathParameters.timestamp);
    const user = getUser(event.headers)

    await dynamodb.delete({
      TableName: tableName,
      Key: {
        user_id: user.id,
        timestamp
      }
    }).promise()

    return {}
  })
}