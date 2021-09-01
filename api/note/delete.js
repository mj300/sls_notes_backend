/**
 *Route : DELETE /note/{timestamp}
 */
const AWS = require("aws-sdk");
const { getResponseHeaders, getUserId } = require("../../utils/util");
const { responseError } = require("../../utils/errorHandling");
AWS.config.update({ region: "eu-west-2" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    const timestamp = parseInt(event.pathParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        timestamp,
        user_id: getUserId(event.headers),
      },
    };
    await dynamoDb.delete(params).promise();

    return {
      statusCode: 201,
      headers: getResponseHeaders(),
    };
  } catch (error) {
    return responseError(error);
  }
};
