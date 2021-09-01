/**
 *Route : GET /notes
 */
const AWS = require("aws-sdk");
const { responseError } = require("../../utils/errorHandling");
const { getUserId, getResponseHeaders } = require("../../utils/util");
AWS.config.update({ region: "eu-west-2" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters;
    const limit = query && query.limit ? parseInt(query.limit) : 5;

    const user_id = getUserId(event.headers);

    let params = {
      TableName: tableName,
      KeyConditionExpression: "user_id=:uid",
      ExpressionAttributeValues: {
        ":uid": user_id,
      },
      Limit: limit,
      ScanIndexForward: false,
    };

    let startTimestamp = query && query.start ? parseInt(query.start) : 0;

    if (startTimestamp > 0) {
      params.ExclusiveStartKey = {
        user_id,
        timestamp: startTimestamp,
      };
    }

    let notes = await dynamoDb.query(params).promise();

    return {
      statusCode: 201,
      headers: getResponseHeaders(),
      body: JSON.stringify(notes),
    };
  } catch (error) {
    return responseError(error);
  }
};
