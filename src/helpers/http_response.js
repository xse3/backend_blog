/**
 * HTTP Response
 * @param {boolean} code http status code
 * @param {string} message description message for response
 * @param {object} data
 * @returns
 */
function httpresponse(code, message, data) {
  var status = "";
  if (code === 200) status = "OK";
  if (code === 201) status = "CREATED";
  if (code === 400) status = "BAD_REQUEST";
  if (code === 401) status = "UNAUTHORIZED";
  if (code === 403) status = "FORBIDDEN";
  if (code === 404) status = "NOT_FOUND";
  if (code === 500) status = "INTERNAL_SERVER_ERROR";

  var obj = {
    code: code,
    status: status,
    message: message,
  };

  if (data) obj.data = data.data;
  if (data) obj.pagination = data.pagination;
  if (data) obj.errors = data.errors;

  return obj;
}

export default httpresponse;
