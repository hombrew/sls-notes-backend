/**
 * Route: PATCH /note
 */

const AWS = require('aws-sdk');
const moment = require('moment');
const {MethodResponse, getUser} = require('../helper');

AWS.config.update({region: 'sa-east-1'});


const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  return MethodResponse(async () => {
    const user = getUser(event.headers)

    const item = {
      ...JSON.parse(event.body).Item,
      user_id: user.id,
      user_name: user.name,
      expires: moment().add(90, 'days').unix()
    }

    await dynamodb.put({
      TableName: tableName,
      Item: item,
      ConditionExpression: '#t = :t',
      ExpressionAttributeNames: {
        '#t': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':t': item.timestamp
      }
    }).promise();

    return item;
  })
}