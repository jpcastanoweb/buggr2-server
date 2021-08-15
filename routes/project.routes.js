const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const projectController = require("./../controllers/project.controller")

router.get(
  "/",
  [check("belongsTo", "Org Id is required").notEmpty()],
  projectController.getAllProjects
)

router.get("/:projectId", projectController.getSingleProject)

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
  "/:projectId/edit",
  [
    check("title", "Title is required").notEmpty(),
    check("startDate", "Start Date  is required").notEmpty(),
    check("dueDate", "Due Date is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
    check("currentStage", "Stage is required.").notEmpty(),
    //add check for dates
  ],
  projectController.updateProject
)

router.post("/:projectId/delete", projectController.deleteProject)

module.exports = router
