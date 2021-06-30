const express = require("express");
const router = express.Router();
const auth = require("./auth/middleware/auth");
const auth_gen = require("./auth/auth_gen");
const userChk = require("./utils/users.utils");
const User = require("./models/users.model");
const UserController = require("./controllers/users.controllers");

const query = (req, res, next) => {
  User.queryUserExist(req.body)
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        req.body.s = rows[0].s;
        next();
      } else {
        res.status(400).json({
          msg: "User not found",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        err: err.message,
        msg: "Error occurs when logging into the system",
      });
    });
};

const authUser = (req, res) => {
  [req.body.s, req.body.password] = userChk._pwdGen(
    req.body.password,
    req.body.s
  );

  User.queryMatch(req.body)
    .then((data) => {
      const _data = data[0][0];
      if (_data.count > 0) {
        auth_gen.generateTokenInCookie(res, _data._id);
        res.status(200).json({
          msg: "Logged in",
        });
        // const refreshTokens = [];
        // const accessToken = auth_gen.generateAccessToken(_data._id);
        // const refreshToken = auth_gen.generateRefreshToken(_data._id);
        // refreshTokens.push(refreshToken);
        // res.json({
        //   accessToken,
        //   refreshTokens,
        // });
      } else {
        res.status(400).json({
          msg: "Error occurs when logging in",
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (req.body.include) {
  }
};

router.get("/auth/verify", auth.authenticateToken, (req, res) => {
  res.status(200).json({
    msg: "Good",
  });
});

router.get("/auth/jwt", auth.authenticateJWT, (req, res) => {
  res.status(200).json({
    msg: "JWT Token authenticated",
  });
});

router.post("/login", query, authUser);

router.post("/token");

module.exports = router;
