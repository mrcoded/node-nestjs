
const requestLogger = (req, res, next) => {
  const timeStamp = new Date().toString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent");

  console.log(`[${timeStamp} ${method} ${url} ${userAgent}]`);
  next();
};

const addTimestamp = (
  req,
  res,
  next
) => {
  req.timeStamp = new Date().toString();

  next();
};

module.exports = { requestLogger, addTimestamp };
