const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const userController = require("./../controllers/user.controller")

// User Creation

router.post(
  "/register",
  [
    check("email", "Email is required").notEmpty().isEmail(),
    check("password", "Password is required").notEmpty(),
    check(
      "password",
      "Password must be at least 8 characters, must include at least 1 lowercase letter, 1 uppercase letter, 1 symbol and 1 number. "
    ).isStrongPassword(),
    check("firstName", "First Name is required.").notEmpty(),
    check("lastName", "Last Name is required.").notEmpty(),
  ],
  userController.registerUser
)

module.exports = router
