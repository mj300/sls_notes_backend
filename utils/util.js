const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
  };
};

const getUserId = (headers) => {
  if (headers && headers.app_user_id) return headers.app_user_id;

  throw new Error("app_user_id is require in headers");
};
const getUserName = (headers) => {
  if (headers && headers.app_user_name) return headers.app_user_name;
  throw new Error("app_user_id is require in headers");
};

module.exports = {
  getResponseHeaders,
  getUserId,
  getUserName,
};
