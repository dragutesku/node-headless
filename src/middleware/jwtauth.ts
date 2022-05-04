const jwt = require("jsonwebtoken");
const config = process.env;


/**
 * AUTH GUARD
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {*} 
 */

// TODO: Posting fast and doing multiple actions with auth guard fails api
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403)
      .json({ error: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401)
      .json({ error: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
