const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const customerController = require("./../controllers/customer.controller")

// GET ALL
router.post("/", customerController.getAllCustomers)

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
router.get("/:customerid", customerController.getSingleCustomer)

// --- UPDATE
router.post(
  "/:customerId/edit",
  [check("name", "Name is Required").notEmpty()],
  customerController.updateCustomer
)

// --- DELETE
router.post("/:customerId/delete", customerController.deleteCustomer)

module.exports = router
