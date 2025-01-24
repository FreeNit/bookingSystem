const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const emailRegExp =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.users_getAllUsers = (req, res, next) => {
  User.find()
    .select("userName email userType")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs,
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.users_getUsers_typeBusiness = (req, res, next) => {
  User.find({ userType: "business" })
    .select("userName email, userType")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        businessUsers: docs,
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.users_updateUserData = (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};

  for (const ops of req.body) {
    if (ops.propName === "email" && !ops.value.match(emailRegExp)) {
      return res.status(500).json({ message: "Not correct email format" });
    }
    updateOps[ops.propName] = ops.value;
  }

  User.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
    .then((result) => {
      const response = {
        _id: result._id,
        userName: result.userName,
        email: result.email,
        userType: result.userType,
      };
      res
        .status(200)
        .json({ message: "User successfully updated", updatedUser: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.users_deleteUser = (req, res, next) => {
  const id = req.params.userId;

  User.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        const response = {
          _id: result._id,
          email: result.email,
          userType: result.userType,
        };
        res.status(200).json({
          message: "User successfully deleted",
          deletedUser: response,
        });
      } else {
        console.log("User not found");
        res.status(404).json({ message: "User to delete not found" });
      }
    })
    .catch((err) => {
      console.log("Error deleting item: ", err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.users_signUp = (req, res, next) => {
  // Check if user with current email already exist
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length >= 1) {
        // 409 - conflict
        return res
          .status(409)
          .json({ message: "User with current email is already existed" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.json(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              userType: req.body.userType,
              userName: req.body.userName,
            });

            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User Created",
                  newUser: {
                    _id: result.id,
                    email: result.email,
                    userType: result.userType,
                    userName: req.body.userName,
                  },
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.users_logIn = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id,
              email: user[0].email,
              userName: user[0].userName,
              userType: user[0].userType,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
