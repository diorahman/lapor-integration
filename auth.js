var KEY = require('./key');

module.exports = function (req, res, next) {
  function unauthorized(res) {
    return res.sendStatus(401);
  };
  if (!req.headers.authorization || req.headers.authorization != KEY.fromApp)
    return unauthorized(res);
  next();
};
