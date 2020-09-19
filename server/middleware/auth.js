const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // Authorization header
  const token = req.get("Authorization");

  if (!token) {
    let err = new Error("not Authenticated");
    (err.status = 401), next(err);
  }

  try {
    let decodedToken = await jwt.verify(token, process.env.SECRET);

    if (!decodedToken) {
      let err = new Error("Not authenticated");
      err.status = 401;
      throw err;
    }

    req.userId = decodedToken.userId;
    req.isAuthenticated = true;
    next();
  } catch (err) {
    next(err);
  }
};
