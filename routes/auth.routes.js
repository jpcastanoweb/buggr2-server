const express = require("express")
const router = express.Router()
const authController = require("./../controllers/auth.controller")
const auth = require("./../middlewares/auth.middleware")

// Start Session
router.post("/login", authController.loginUser)

// Verify session
router.get("/", auth, authController.verifyingToken)

// Verify session
module.exports = router
