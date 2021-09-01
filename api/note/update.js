/**
 *Route : Put /note/n/{note_id}
 */
const AWS = require("aws-sdk");
const {
  getResponseHeaders,
  getUserId,
  getUserName,
} = require("../../utils/util");
const { responseError } = require("../../utils/errorHandling");
AWS.config.update({ region: "eu-west-2" });
const moment = require("moment");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = getUserId(event.headers);
    item.user_name = getUserName(event.headers);
    item.expires = moment().add(90, "day").unix();

    await dynamoDb
      .put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "#t=:t",
        ExpressionAttributeNames: {
          "#t": "timestamp",
        },
        ExpressionAttributeValues: {
          ":t": item.timestamp,
        },
      })
      .promise();
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(item),
    };
  } catch (error) {
    return responseError(error);
  }
};
