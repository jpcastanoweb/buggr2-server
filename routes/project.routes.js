const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const projectController = require("./../controllers/project.controller")

router.post("/", projectController.getAllProjects)

router.get("/:projectid", projectController.getSingleProject)

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

router.post(
  "/:projectid/edit",
  [
    check("title", "Title is required").notEmpty(),
    check("startDate", "Start Date  is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
    check("currentStage", "Stage is required.").notEmpty(),
    //add check for dates
  ],
  projectController.updateProject
)

router.post("/:projectid/delete", projectController.deleteProject)

router.post(
  "/:projectid/addcontact",
  [check("contactid", "Contact ID is required").notEmpty()],
  projectController.addContact
)

router.post(
  "/:projectid/assignmaincontact",
  [check("contactid", "Contact ID is required").notEmpty()],
  projectController.assignMainContact
)

module.exports = router
