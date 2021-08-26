const Organization = require("./../models/Organization.model")
const Customer = require("./../models/Customer.model")
const Opportunity = require("./../models/Opportunity.model")
const Project = require("./../models/Project.model")
const mongoose = require("mongoose")

const { validationResult } = require("express-validator")

exports.getAllOpportunities = async (req, res) => {
  const { belongsTo } = req.body
  try {
    let opps = await Opportunity.find({
      belongsTo,
    }).populate("forCustomer")

    return res.json(opps)
  } catch (error) {
    console.log("Error loading opportunities", error.message)
  }
}

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
  const { opportunityid } = req.params

  try {
    const opp = await Opportunity.findById(opportunityid)
      .populate("belongsTo")
      .populate("forCustomer")
      .populate("associatedContacts")
      .populate("mainContact")
      .populate("notes")

    return res.json(opp)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.updateOpportunity = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const {
      title,
      openedDate,
      closeDate,
      dollarValue,
      currentStage,
      mainContact,
    } = req.body
    const { opportunityid } = req.params

    const updatedOpportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityid },
      {
        title,
        openedDate,
        closeDate,
        dollarValue,
        currentStage,
        mainContact,
      },
      {
        runValidators: true,
        new: true,
      }
    )

    res.json(updatedOpportunity)
  } catch (error) {
    console.log("Error editing opportunity: ", error.message)
    res.status(400).json(error)
  }
}

exports.deleteOpportunity = async (req, res) => {
  const { opportunityid } = req.params

  try {
    const opportunity = await Opportunity.findById(opportunityid)

    // delete id from customer projects
    await Customer.findByIdAndUpdate(opportunity.forCustomer, {
      $pull: { opportunities: opportunityid },
    })
    // delete id from org opps
    await Organization.findByIdAndUpdate(opportunity.belongsTo, {
      $pull: { opportunities: opportunityid },
    })

    // delete opp
    const deletedOpportunity = await Opportunity.findByIdAndDelete(
      opportunityid
    )

    res.json(deletedOpportunity)
  } catch (error) {
    console.log("Error deleting opportunity: ", error.message)
    res.status(400).json(error)
  }
}

exports.convertOpportunity = async (req, res) => {
  const { opportunityid } = req.params
  const { title, dueDate } = req.body

  try {
    const opp = await Opportunity.findById(opportunityid)

    const startDate = new Date()
    const newDocuments = []

    for (let i = 0; i < opp.documents.length; i++) {
      newDocuments.push({
        name: opp.documents[i].name,
        fileType: opp.documents[i].fileType,
        docUrl: opp.documents[i].docUrl,
      })
    }

    // create new project
    const newProject = await Project.create({
      title,
      belongsTo: opp.belongsTo,
      forCustomer: opp.forCustomer,
      startDate,
      dueDate,
      wasOpp: true,
      oppOpenedDate: opp.openedDate,
      oppCloseDate: opp.closeDate,
      currentStage: "Analysis",
      dollarValue: opp.dollarValue,
      documents: newDocuments,
    })
    const updatedOpp = await Opportunity.findByIdAndUpdate(
      opportunityid,
      {
        currentStage: "Closed - Won",
      },
      { new: true }
    )

    // adding to org and customer
    await Organization.findByIdAndUpdate(newProject.belongsTo, {
      $push: { projects: newProject._id },
    })

    await Customer.findByIdAndUpdate(newProject.forCustomer, {
      $push: { projects: newProject._id },
    })

    res.json({
      opportunity: updatedOpp,
      project: newProject,
    })
  } catch (error) {
    console.log("Error converting opp to project", error.message)
    res.status(400).json({ msg: error.message })
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
    const { opportunityid } = req.params

    let opportunity = await Opportunity.findById(opportunityid)

    opportunity = await Opportunity.findByIdAndUpdate(
      opportunityid,
      {
        $push: { associatedContacts: contactid },
      },
      { new: true }
    )
      .populate("belongsTo")
      .populate("forCustomer")
      .populate("associatedContacts")
      .populate("mainContact")
      .populate("notes")

    res.json(opportunity)
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
    const { opportunityid } = req.params

    const opportunity = await Opportunity.findById(opportunityid)

    let updatedOpportunity

    if (opportunity.associatedContacts.includes(contactid)) {
      updatedOpportunity = await Opportunity.findByIdAndUpdate(
        opportunityid,
        { mainContact: contactid },
        { new: true }
      )
        .populate("belongsTo")
        .populate("forCustomer")
        .populate("associatedContacts")
        .populate("mainContact")
        .populate("notes")
    } else {
      updatedOpportunity = await Opportunity.findByIdAndUpdate(
        opportunityid,
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
        .populate("notes")
    }

    res.json(updatedOpportunity)
  } catch (error) {
    res.status(400).json(error)
  }
}
