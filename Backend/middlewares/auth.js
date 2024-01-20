const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Extract token from header authorization (without "Bearer" word)
    const token = req.headers.authorization.split(' ')[1];
    // Use jwt's verify function to decode the token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    const userId = decodedToken.userId;
    // Add userId to req by creating an "auth" object
    //so that routes can use it to authenticate future requests
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    // possible errors during decoding
    res.status(401).json({ error });
  }
};
