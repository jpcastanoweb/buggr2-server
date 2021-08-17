const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const opportunityController = require("./../controllers/opportunity.controller")

router.post("/", opportunityController.getAllOpportunities)

router.get("/:opportunityid", opportunityController.getSingleOpportunity)

router.post(
  "/create",
  [
    check("title", "Title is required").notEmpty(),
    check("belongsTo", "Organization owner is required").notEmpty(),
    check("forCustomer", "Customer is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
  ],
  opportunityController.createOpportunity
)

router.post(
  "/:opportunityid/edit",
  [
    check("title", "Title is required").notEmpty(),
    check("openedDate", "Opened Date  is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
    check("currentStage", "Stage is required.").notEmpty(),
    //add check for dates
  ],
  opportunityController.updateOpportunity
)

router.post("/:opportunityid/delete", opportunityController.deleteOpportunity)

router.post(
  "/:opportunityid/convert",
  [
    check("title", "Project title is required.").notEmpty(),
    check("dueDate", "Due date is required.").notEmpty(),
  ],
  opportunityController.convertOpportunity
)
module.exports = router
