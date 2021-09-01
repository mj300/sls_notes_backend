const { getResponseHeaders } = require("./util");

const responseError = (error) => {
  if (process.env.ENV_NAME === "dev") console.error(error);
  return {
    statusCode: error.statusCode ? error.statusCode : 500,
    headers: getResponseHeaders(),
    body: JSON.stringify({
      message:
        process.env.ENV_NAME === "dev" ? error.message : "Somthing went wrong.",
    }),
  };
};
module.exports = {
  responseError,
};
