/**
 *Route : GET /note/{note_id}
 */
const AWS = require("aws-sdk");
const { getResponseHeaders } = require("../../utils/util");
const { responseError } = require("../../utils/errorHandling");
const _ = require("underscore");
AWS.config.update({ region: "eu-west-2" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    const note_id = event.pathParameters.note_id;

    let params = {
      TableName: tableName,
      IndexName: "note_id-index",
      KeyConditionExpression: "note_id=:nid",
      ExpressionAttributeValues: {
        ":nid": note_id,
      },
      Limit: 1,
    };

    const data = await dynamoDb.query(params).promise();
    console.log(params);
    if (!_.isEmpty(data.Items))
      return {
        statusCode: 200,
        headers: getResponseHeaders(),
        body: JSON.stringify(data.Items[0]),
      };
    else {
      return {
        statusCode: 404,
        headers: getResponseHeaders(),
        body: JSON.stringify("Note not found."),
      };
    }
  } catch (error) {
    return responseError(error);
  }
};
