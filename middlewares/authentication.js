const jwt = require("jsonwebtoken");

const config = process.env;

exports.verifyToken = (req, role, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    if (decoded.role === role) {
      req.user = decoded
      next();
    }
    else
      return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
   //req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  //return next();
};
