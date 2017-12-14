const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    }).end()
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1]

  // decode the token using a secret key-phrase
  return jwt.verify(token, 's0m3 r4nd0m str1ng', (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      }).end()
    }
    const username = decoded;
    User.find({ username }).then(foundUser => {
      foundUser = foundUser[0];
      if(!foundUser.isAdmin){
        return res.status(401).json({
          success: false,
          message: "This route is only for admin"
        }).end()
      }
      req.user = foundUser;
      return next();
    }).catch(() => {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      }).end()
    })
  })
}
