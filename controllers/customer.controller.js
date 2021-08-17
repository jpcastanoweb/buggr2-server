const Organization = require("./../models/Organization.model")
const Customer = require("./../models/Customer.model")

const { validationResult } = require("express-validator")

exports.getAllCustomers = async (req, res) => {
  const { belongsTo } = req.body

  try {
    let customers = await Customer.find({
      belongsTo,
    })
    return res.json(customers)
  } catch (error) {
    console.log("Error loading customers", error.message)
  }
}

exports.createCustomer = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).json({
      msg: errors.array(),
    })
  }

  const { name, belongsTo } = req.body

  try {
    const newCustomer = await Customer.create({
      name,
      belongsTo,
    })

    await Organization.findByIdAndUpdate(
      belongsTo,
      { $push: { customers: newCustomer._id } },
      { new: true }
    )

    return res.json(newCustomer)
  } catch (error) {
    console.log("Error creating customer", error.message)
  }

  console.log(name, belongsTo)
}

exports.getSingleCustomer = async (req, res) => {
  const { customerId } = req.params

  if (!customerId) {
    return res.status(400).json({
      msg: "No customer id supplied.",
    })
  }

  try {
    const foundCustomer = await Customer.findById(customerId)
    console.log(foundCustomer)

    if (!foundCustomer) {
      res.status(400).json({
        msg: "Customer not found",
      })
    }

    res.json(foundCustomer)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

exports.updateCustomer = async (req, res) => {
  const { customerId } = req.params

  if (!customerId) {
    return res.status(400).json({
      msg: "No customer id supplied.",
    })
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).json({
      msg: errors.array(),
    })
  }

  const { name } = req.body

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { name },
      { new: true }
    )

    console.log(updatedCustomer)
    res.json(updatedCustomer)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteCustomer = async (req, res) => {
  const { customerId } = req.params

  try {
    const customer = await Customer.findById(customerId)

    // delete all projects
    for (let i = 0; i < customer.projects.length; i++) {
      // delete from org
      await Organization.findByIdAndUpdate(customer.belongsTo, {
        $pull: { projects: customer.projects[i] },
      })
      // delete project
      await Project.findByIdAndDelete(customer.projects[i])
    }

    // delete opportunities
    for (let i = 0; i < customer.opportunities.length; i++) {
      //delete from org
      await Organization.findByIdAndUpdate(customer.belongsTo, {
        $pull: { opportunities: customer.opportunities[i] },
      })
      //delete opportunity
      await Opportunity.findByIdAndDelete(customer.opportunities[i])
    }

    // delete customer from org.customers
    await Organization.findByIdAndUpdate(customer.belongsTo, {
      $pull: { customers: customerId },
    })

    //delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(customerId)

    //redirect
    res.json(deletedCustomer)
  } catch (error) {
    console.log("Error while deleting customer: ", error.message)
    res.status(400).json(error)
  }
}
