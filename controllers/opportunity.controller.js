const Organization = require("./../models/Organization.model")
const Customer = require("./../models/Customer.model")
const Opportunity = require("./../models/Opportunity.model")
const mongoose = require("mongoose")

const { validationResult } = require("express-validator")

exports.createOpportunity = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  const {
    title,
    forCustomer,
    belongsTo,
    dollarValue,
    openedDate,
    closeDate,
    currentStage,
  } = req.body

  const belongsToObject = mongoose.Types.ObjectId(belongsTo)
  const forCustomerObject = mongoose.Types.ObjectId(forCustomer)

  try {
    //create new opp
    const data = {
      title,
      belongsTo: belongsToObject,
      forCustomer: forCustomerObject,
      dollarValue,
    }

    data.openedDate = openedDate ? openedDate : new Date()
    data.closeDate = closeDate ? closeDate : null
    data.currentStage = currentStage ? currentStage : "New"

    const newOpp = await Opportunity.create(data)

    //add  opp to customer's opps
    await Customer.findByIdAndUpdate(forCustomer, {
      $push: { opportunities: newOpp._id },
    })

    //add opp to currentOrg's opps
    await Organization.findByIdAndUpdate(belongsTo, {
      $push: { opportunities: newOpp._id },
    })

    //return response
    return res.json(newOpp)
  } catch (error) {
    console.log("Error while creating project", error)
    return res.json(error)
  }
}

exports.getSingleOpportunity = async (req, res) => {
  const { opportunityId } = req.params

  try {
    const opp = await Opportunity.findById(opportunityId)
      .populate("belongsTo")
      .populate("forCustomer")

    return res.json(opp)
  } catch (error) {
    res.status(400).json(error)
  }
}