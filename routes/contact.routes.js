const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const contactController = require("./../controllers/contact.controller")

// CREATE CONTACT
router.post(
  "/create",
  [
    check("firstName", "Contact's first name is required.").notEmpty(),
    check("email", "Contact's email address is required.").notEmpty(),
    check("ownerid", "Contacts' owner id is required").notEmpty(),
  ],
  contactController.createContact
)

// GET
router.get("/:contactid", contactController.getSingleContact)

// UPDATE CONTACT
router.post(
  "/:contactid/edit",
  [
    check("firstName", "Contact's first name is required.").notEmpty(),
    check("email", "Contact's email address is required.").notEmpty(),
  ],
  contactController.updateContact
)

// DELETE CONTACT
router.post(
  "/:contactid/delete",
  [check("ownerid", "Contacts' owner id is required").notEmpty()],
  contactController.deleteContact
)

module.exports = router
