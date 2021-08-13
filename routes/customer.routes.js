const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const customerController = require("./../controllers/customer.controller")

router.post(
  "/create",
  [
    check("name", "Name is Required").notEmpty(),
    check("belongsTo", "Owner organization is required.").notEmpty(),
  ],
  customerController.createCustomer
)

router.get("/:customerId", customerController.getSingleCustomer)

module.exports = router
