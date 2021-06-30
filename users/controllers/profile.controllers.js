const ProfileModel = require("../models/profile.model");

exports.createProfile = (req, res) => {
  ProfileModel.createProfile(req.body)
    .then(([result, fields]) => {
      if (result.affectedRows == 1) {
        res.status(200).json({
          msg: "User profile created",
        });
      } else {
        res.status(400).json({
          msg: "Fail when creating user profile",
        });
      }
    })
    .catch((err) => {
      console.error(err.message);
      let errMsg;
      if (err.sqlState) {
        errMsg = `[${err.sqlState}] ${err.code}`;
      } else {
        errMsg = err.message;
      }
      res.status(400).json({
        msg: "Oops! Something went wrong when creating profile",
        err: errMsg,
      });
    });
};

exports.updateProfile = (req, res) => {
  ProfileModel.updateProfile(req.body)
    .then(([result, fields]) => {
      console.log(result);
      if (result.affectedRows > 0) {
        res.status(200).json({
          msg: "User profile updated",
        });
      } else {
        res.status(400).json({
          msg: "Fail when updating user profile",
        });
      }
    })
    .catch((err) => {
      console.error(err.message);
      let errMsg;
      if (err.sqlState) {
        errMsg = `[${err.sqlState}] ${err.code}`;
      } else {
        errMsg = err.message;
      }
      res.status(400).json({
        msg: "Oops! Something went wrong when updating profile",
      });
    });
};

exports.findProfileById = (req, res) => {
  const userId = req.params.id;
  let queryPromise;
  if (req.query.view) {
    queryPromise = ProfileModel.queryProfileInfoWithId(userId);
  } else {
    queryPromise = ProfileModel.queryProfileWithId(userId);
  }
  queryPromise
    .then(([rows, fields]) => {
      console.log(rows);
      if (rows.length > 0) {
        res.status(200).json({
          info: rows[0],
        });
      } else {
        res.status(404).json({
          msg: "Profile not found",
        });
      }
    })
    .catch((err) => {
      console.error(err.message);
      res.sendStatus(400);
    });
};

exports.testProfile = (req, res) => {
  res.status(200).json({
    msg: "Profile here. Test completed.",
  });
};
