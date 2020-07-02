/**
 * Route: GET /notes
 */

const AWS = require('aws-sdk');
const {MethodResponse, getUser} = require('../helper');

AWS.config.update({region: 'sa-east-1'});


const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  return MethodResponse(async () => {
    const query = event.queryStringParameters;
    const limit = query && query.limit ? parseInt(query.limit) : 5;
    const user = getUser(event.headers)

    const params = {
      TableName: tableName,
      KeyConditionExpression: 'user_id = :uid',
      ExpressionAttributeValues: {
        ':uid': user.id
      },
      Limit: limit,
      ScanIndexForward: false
    }

    const startTimeStamp = query && query.start ? parseInt(query.start) : 0;

    if (startTimeStamp > 0) {
      params.ExclusiveStartKey = {
        user_id: user.id,
        timestamp: startTimeStamp
      }
    }

    return dynamodb.query(params).promise()
  })
}