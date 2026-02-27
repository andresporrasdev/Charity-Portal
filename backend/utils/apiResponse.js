const sendSuccess = (res, statusCode, data, extras = {}) => {
  const body = { status: "success", ...extras };
  if (data != null) body.data = data;
  return res.status(statusCode).json(body);
};

const sendFail = (res, statusCode, message, extras = {}) =>
  res.status(statusCode).json({ status: "fail", message, ...extras });

const sendError = (res, message) =>
  res.status(500).json({ status: "error", message });

module.exports = { sendSuccess, sendFail, sendError };
