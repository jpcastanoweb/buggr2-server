const Organization = require("./../models/Organization.model")
const Customer = require("./../models/Customer.model")
const Project = require("./../models/Project.model")

const mongoose = require("mongoose")

const { validationResult } = require("express-validator")

exports.createProject = async (req, res) => {
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
    startDate,
    dueDate,
    currentStage,
  } = req.body

  const belongsToObject = mongoose.Types.ObjectId(belongsTo)
  const forCustomerObject = mongoose.Types.ObjectId(forCustomer)

  try {
    const data = {
      title,
      belongsTo: belongsToObject,
      forCustomer: forCustomerObject,
      dollarValue,
    }

    data.startDate = startDate ? startDate : new Date()
    data.dueDate = dueDate ? dueDate : null
    data.currentStage = currentStage ? currentStage : "Analysis"

    console.log("Data", data)
    const newProject = await Project.create(data)

    console.log(newProject)

    //add project to customer's projects
    await Customer.findByIdAndUpdate(forCustomer, {
      $push: { projects: newProject._id },
    })

    //add project to currentOrg's opps
    await Organization.findByIdAndUpdate(belongsTo, {
      $push: { projects: newProject._id },
    })

    return res.json(newProject)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error })
  }
}

exports.getSingleProject = async (req, res) => {
  const { projectId } = req.params

  try {
    const project = await Project.findById(projectId)
      .populate("belongsTo")
      .populate("forCustomer")

    return res.json(project)
  } catch (error) {
    res.status(400).json(error)
  }
}
