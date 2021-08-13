const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const projectController = require("./../controllers/project.controller")

router.post(
  "/create",
  [
    check("title", "Title is required").notEmpty(),
    check("belongsTo", "Organization owner is required").notEmpty(),
    check("forCustomer", "Customer is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
    //add check for dates
  ],
  projectController.createProject
)

router.get("/:projectId", projectController.getSingleProject)

module.exports = router