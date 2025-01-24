const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const UsersController = require("../controllers/users");

// -> Get All Users
router.get("/", checkAuth, UsersController.users_getAllUsers);

// -> Get all userBusiness
router.get("/business", checkAuth, UsersController.users_getUsers_typeBusiness);

// -> Update user data
router.patch("/:userId", checkAuth, UsersController.users_updateUserData);

// -> Delete user
router.delete("/:userId", checkAuth, UsersController.users_deleteUser);

// -> Sign up
router.post("/signup", UsersController.users_signUp);

// -> Sign in
router.post("/login", UsersController.users_logIn);

module.exports = router;
