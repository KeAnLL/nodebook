const UserModel = require("../models/users.model");
const userChk = require("../utils/users.utils");
const userToken = require("../auth/auth_gen");

exports.createUser = (req, res) => {
  if (userChk.userFieldChk(req.body)) {
    if (userChk._emailChk(req.body.email)) {
      if (req.body.username === undefined) {
        req.body.username = userChk.defaultMailNameGen(req.body.email);
      }

      req.body.password = userChk._pwdGen(req.body.password);

      // check username existance
      UserModel.queryUserByUsername(req.body.username)
        .then(([rows, fields]) => {
          if (rows.length > 0) {
            res.status(400).send({
              msg: "Username is used",
              rows,
            });
          } else {
            UserModel.queryUserByEmail(req.body.email)
              .then(([rows, fields]) => {
                if (rows.length > 0) {
                  res.status(400).send({
                    msg: "Email is used",
                    rows,
                  });
                } else {
                  UserModel.createUser(req.body)
                    .then(async ([result, fields]) => {
                      if (result.affectedRows > 0) {
                        userToken.generateTokenInCookie(res, result.insertId);

                        res.status(201).send({
                          msg: "User created",
                        });
                      } else {
                        res.status(400).json({
                          msg: "Fail when creating user",
                        });
                      }
                    })
                    .catch((err) => {
                      console.error(err.message);
                      res.status(500).send({
                        err: err.message,
                        when: "Creating user",
                        msg: "Create failed",
                      });
                    });
                }
              })
              .catch((err) => {
                console.error(err.message);
                res.status(500).send({
                  err: err.message,
                  when: "Querying email",
                  msg: "Create failed",
                });
              });
          }
        })
        .catch((err) => {
          console.error(err.message);
          res.status(500).send({
            err: err.message,
            when: "Querying username",
            msg: "Create failed",
          });
        });
    } else {
      res.status(400).send({
        msg: "Bad email syntax. Please insert a correct email",
      });
    }
  } else {
    res.status(400).send({
      msg: "Insufficient user data",
    });
  }
};

exports.login = (req, res) => {};

exports.updateUser = (req, res) => {
  if (userChk.userFieldChk(req.body)) {
    if (userChk._emailChk(req.body.email)) {
      req.body.password = userChk._pwdGen(req.body.password);

      UserModel.updateUser(req.params)
        .then(([rows, fields]) => {
          res.status(200).send(rows);
        })
        .catch((err) => {
          console.error(err.message);
          res.status(500).send({
            err: err.message,
            msg: "Update failed",
          });
        });
    } else {
      res.status(400).send({
        msg: "Bad email syntax. Please insert a correct email",
        res: "Failed to update user information",
      });
    }
  } else {
    res.status(400).send({
      msg: "Insufficient user data",
    });
  }
};

exports.findUserById = (req, res) => {
  const userId = req.query.id;

  UserModel.queryUserById(userId)
    .then(([rows, fields]) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(400).send({ error: "User ID in used" });
    });
};

exports.findUserByUsername = (req, res) => {
  const username = req.query.username;
  UserModel.queryUserByUsername(username)
    .then(([rows, fields]) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(400).send({ error: "Username exists" });
    });
};

exports.findUserByEmail = (req, res) => {
  const email = req.query.email;
  UserModel.queryUserByEmail(email)
    .then(([rows, fields]) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(400).send({ error: "Email in used in other account" });
    });
};

exports.testUser = (req, res) => {
  if (req.cookies.token) {
    res.status(200).send({ user: "Test message received!" });
  } else {
    res.status(401).send({ msg: "Login required" });
  }
};
