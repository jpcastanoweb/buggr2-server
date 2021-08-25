const Note = require("./../models/Note.model")
const Customer = require("./../models/Customer.model")
const Project = require("./../models/Project.model")
const Opportunity = require("./../models/Opportunity.model")

const { validationResult } = require("express-validator")

exports.createNote = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).send({
      msg: errors.array(),
    })
  }

  try {
    const { title, content, onModel, ownerid } = req.body

    const newNote = await Note.create({
      title,
      content,
      belongsTo: ownerid,
      onModel,
    })

    let updatedOwner
    switch (onModel) {
      case "Customer":
        updatedOwner = await Customer.findByIdAndUpdate(
          ownerid,
          {
            $push: { notes: newNote._id },
          },
          { new: true }
        )
        break
      case "Project":
        updatedOwner = await Project.findByIdAndUpdate(
          ownerid,
          {
            $push: { notes: newNote._id },
          },
          { new: true }
        )
        break
      case "Opportunity":
        updatedOwner = await Opportunity.findByIdAndUpdate(
          ownerid,
          {
            $push: { notes: newNote._id },
          },
          { new: true }
        )
        break
      default:
        break
    }

    res.json({ note: newNote, owner: updatedOwner })
  } catch (error) {
    console.log(error)
  }
}

exports.updateNote = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(403).send({
      msg: errors.array(),
    })
  }

  try {
    const { title, content } = req.body
    const { noteid } = req.params

    const updatedNote = await Note.findByIdAndUpdate(
      noteid,
      {
        title,
        content,
      },
      { new: true }
    )

    res.json(updatedNote)
  } catch (error) {
    console.log(error)
  }
}
