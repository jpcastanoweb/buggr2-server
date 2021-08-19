const Organization = require("./../models/Organization.model")
const Customer = require("./../models/Customer.model")
const Project = require("./../models/Project.model")

const mongoose = require("mongoose")

const { validationResult } = require("express-validator")

exports.getAllProjects = async (req, res) => {
  const { belongsTo } = req.body

  try {
    let projects = await Project.find({
      belongsTo,
    }).populate("forCustomer")

    return res.json(projects)
  } catch (error) {
    console.log("Error loading projects", error.message)
  }
}

exports.getSingleProject = async (req, res) => {
  const { projectid } = req.params

  try {
    const project = await Project.findById(projectid)
      .populate("belongsTo")
      .populate("forCustomer")
      .populate("associatedContacts")
      .populate("mainContact")

    return res.json(project)
  } catch (error) {
    res.status(400).json(error)
  }
}

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
    mainContact,
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

    const newProject = await Project.create(data)

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

exports.updateProject = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const {
      title,
      startDate,
      dueDate,
      dollarValue,
      currentStage,
      mainContact,
    } = req.body
    const { projectid } = req.params

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectid },
      {
        title,
        startDate,
        dueDate,
        dollarValue,
        currentStage,
        mainContact,
      },
      {
        runValidators: true,
        new: true,
      }
    )

    res.json(updatedProject)
  } catch (error) {
    console.log("Error editing project: ", error.message)
    res.status(400).json(error)
  }
}

exports.deleteProject = async (req, res) => {
  const { projectid } = req.params

  try {
    const project = await Project.findById(projectid)

    // delete id from customer projects
    await Customer.findByIdAndUpdate(project.forCustomer, {
      $pull: { projects: projectid },
    })
    // delete id from org opps
    await Organization.findByIdAndUpdate(project.belongsTo, {
      $pull: { projects: projectid },
    })

    // delete opp
    const deletedProject = await Project.findByIdAndDelete(projectid)

    res.json(deletedProject)
  } catch (error) {
    console.log("Error deleting project: ", error.message)
    res.status(400).json(error)
  }
}

exports.addContact = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }
  try {
    const { contactid } = req.body
    const { projectid } = req.params

    let project = await Project.findById(projectid)

    project = await Project.findByIdAndUpdate(
      projectid,
      {
        $push: { associatedContacts: contactid },
      },
      { new: true }
    )
      .populate("belongsTo")
      .populate("forCustomer")
      .populate("associatedContacts")
      .populate("mainContact")

    res.json(project)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.assignMainContact = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const { contactid } = req.body
    const { projectid } = req.params

    const project = await Project.findById(projectid)

    console.log(project)

    let updatedProject

    console.log(project.associatedContacts)

    if (project.associatedContacts.includes(contactid)) {
      updatedProject = await Project.findByIdAndUpdate(
        projectid,
        { mainContact: contactid },
        { new: true }
      )
        .populate("belongsTo")
        .populate("forCustomer")
        .populate("associatedContacts")
        .populate("mainContact")
    } else {
      updatedProject = await Project.findByIdAndUpdate(
        projectid,
        {
          $push: { associatedContacts: contactid },
          mainContact: contactid,
        },
        { new: true }
      )
        .populate("belongsTo")
        .populate("forCustomer")
        .populate("associatedContacts")
        .populate("mainContact")
    }

    res.json(updatedProject)
  } catch (error) {
    res.status(400).json(error)
  }
}
