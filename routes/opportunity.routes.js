const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const opportunityController = require("./../controllers/opportunity.controller")

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

router.get("/:opportunityId", opportunityController.getSingleOpportunity)

router.post(
  "/:opportunityId/edit",
  [
    check("title", "Title is required").notEmpty(),
    check("openedDate", "Opened Date  is required").notEmpty(),
    check("closeDate", "Close Date is required").notEmpty(),
    check("dollarValue", "Dollar value is required.").notEmpty(),
    check("currentStage", "Stage is required.").notEmpty(),
    //add check for dates
  ],
  opportunityController.updateOpportunity
)

router.post("/:opportunityId/delete", opportunityController.deleteOpportunity)

module.exports = router
