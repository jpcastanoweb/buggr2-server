const Contact = require("./../models/Contact.model")
const Customer = require("./../models/Customer.model")

const { validationResult } = require("express-validator")

exports.getSingleContact = async (req, res) => {
  const { contactid } = req.params

  if (!contactid) {
    return res.status(400).json({
      msg: "No contact id supplied.",
    })
  }

  try {
    const foundContact = await Contact.findById(contactid)

    if (!foundContact) {
      res.status(400).json({
        msg: "No contact found with that id.",
      })
    }

    res.json(foundContact)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.createContact = async (req, res) => {
  console.log("entering create contact")
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).json({
      msg: errors.array(),
    })
  }

  console.log("Hola?")
  try {
    const { firstName, lastName, email, phoneNumber, ownerid } = req.body
    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    })

    console.log("New Contact: ", newContact)

    await Customer.findByIdAndUpdate(ownerid, {
      $push: { contacts: newContact._id },
    })

    res.json(newContact)
  } catch (error) {
    console.log(error)
    // res.status(400).json(error)
  }
}

exports.updateContact = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).json({
      msg: errors.array(),
    })
  }

  const { contactid } = req.params
  if (!contactid) {
    return res.status(400).json({
      msg: "No contact id supplied.",
    })
  }

  try {
    const { firstName, lastName, email, phoneNumber } = req.body

    const updatedContact = await Contact.findByIdAndUpdate(
      contactid,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      { new: true }
    )

    console.log("Updated Contact: ", updatedContact)
    res.json(updatedContact)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteContact = async (req, res) => {
  const { contactid } = req.params

  if (!contactid) {
    return res.status(400).json({
      msg: "No contact id supplied.",
    })
  }

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactid)
    res.json(deletedContact)
  } catch (error) {
    res.status(400).json(error)
  }
}
