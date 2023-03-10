const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

module.exports = function(req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
