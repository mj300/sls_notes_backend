/**
 *Route : POST /note
 */
const AWS = require("aws-sdk");
const {
  getUserId,
  getUserName,
  getResponseHeaders,
} = require("../../utils/util");
AWS.config.update({ region: "eu-west-2" });
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { responseError } = require("../../utils/errorHandling");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = getUserId(event.headers);
    item.user_name = getUserName(event.headers);
    item.note_id = `${item.user_id}:${uuidv4()}`;
    item.timestamp = moment().unix();
    item.expires = moment().add(90, "day").unix();
    await dynamoDb
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    return {
      statusCode: 201,
      headers: getResponseHeaders(),
      body: JSON.stringify(item),
    };
  } catch (error) {
    return responseError(error);
  }
};
