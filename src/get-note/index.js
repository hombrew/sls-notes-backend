/**
 * Route: GET /note/n/{note_id}
 */

const AWS = require('aws-sdk');
const _ = require('lodash')
const {MethodResponse} = require('../helper');

AWS.config.update({region: 'sa-east-1'});


const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  return MethodResponse(async () => {
    const note_id = decodeURIComponent(event.pathParameters.note_id);
    const params = {
      TableName: tableName,
      IndexName: 'note_id-index',
      KeyConditionExpression: 'note_id = :note_id',
      ExpressionAttributeValues: {
        ':note_id': note_id
      },
      Limit: 1
    }

    const data = await dynamodb.query(params).promise()
    if (!_.isEmpty(data.Items)) {
      return data.Items[0]
    }

    throw {
      statusCode: 400,
      name: 'item not found'
    }
  })
}