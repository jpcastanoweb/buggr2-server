const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const customerController = require("./../controllers/customer.controller")

// --- CREATE
router.post(
  "/create",
  [
    check("name", "Name is Required").notEmpty(),
    check("belongsTo", "Owner organization is required.").notEmpty(),
  ],
  customerController.createCustomer
)

// --- READ
router.get("/:customerId", customerController.getSingleCustomer)

// --- UPDATE
router.post(
  "/:customerId/edit",
  [check("name", "Name is Required").notEmpty()],
  customerController.updateCustomer
)

module.exports = router
