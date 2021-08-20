const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const userController = require("./../controllers/user.controller")

// User Creation

// --- CREATE
router.post(
  "/register",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Please use a valid email.").isEmail(),
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

// --- UPDATE
router.post(
  "/edit",
  [
    check("user.email", "Email is required").notEmpty(),
    check("user.email", "Please use a valid email.").isEmail(),
    check("user.firstName", "First Name is required.").notEmpty(),
    check("user.lastName", "Last Name is required.").notEmpty(),
  ],
  userController.updateUser
)

// --- UPDATE ACCOUT (EMAIL)
router.post(
  "/:userid/update-email",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Please use a valid email.").isEmail(),
  ],
  userController.updateAccountInfo
)

router.post(
  "/:userid/update-profile",
  [check("firstName", "First Name is required").notEmpty()],
  userController.updateProfileInfo
)

router.post(
  "/:userid/update-subscription-status",
  userController.updateSubscription
)

module.exports = router
