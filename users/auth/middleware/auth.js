const jwt = require("jsonwebtoken");

exports.authenticateToken = async (req, res, next) => {
  const token = req.cookies.token || "";

  //   try {
  //     if (!token) {
  //       return res.status(401).json({});
  //     }

  //     const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
  //     req._id = {
  //       id: decrypt._id,
  //     };
  //     next();
  //   } catch (err) {
  //     return res.status(500).json({
  //       err: err.message,
  //     });
  //   }
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, _id) => {
      if (err) {
        return res.status(403);
      } else {
        req.body._id = _id;
        next();
      }
    });
  } else {
    res.status(401).json({
      msg: "Not verified!",
    });
  }
};

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decrypt) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          res.status(403).json({
            err: "Authentication expired",
          });
        } else {
          res.status(403).json({
            msg: err.message,
          });
        }
      }
      // console.log(decrypt);
      req.body._id = decrypt._id;
      next();
    });
  } else {
    res.status(401).json({
      msg: "Authentication required",
    });
  }
};
