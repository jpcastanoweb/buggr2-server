const User = require("./../models/User.model")
const Organization = require("./../models/Organization.model")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { validationResult } = require("express-validator")

exports.registerUser = async (req, res) => {
  // Check validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  const { email, password, firstName, lastName } = req.body

  const userData = {
    email,
    firstName,
    lastName,
    organizations: [],
  }

  try {
    // hash password before signing up
    const salt = await bcryptjs.genSalt(10)
    const passwordHash = await bcryptjs.hashSync(password, salt)

    //saving passwordHash to the user data
    userData.password = passwordHash

    //creating new User
    const newUser = await User.create(userData)

    const newOrg = await Organization.create({
      name: "My First Org",
      admin: newUser._id,
      users: [newUser._id],
    })

    const updatedUser = await User.findByIdAndUpdate(
      newUser._id,
      { $push: { organizations: newOrg._id } },
      { new: true }
    )
    console.log("User: ", updatedUser)
    console.log("New Org: ", newOrg)

    // User created, creating json web token
    // CREATE A JWT
    const payload = {
      user: {
        id: newUser._id,
      },
    }

    //SIGN THE JSON WEB TOKEN
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000,
      },
      (error, token) => {
        if (error) throw error

        res.json({ token })
      }
    )
  } catch (error) {
    console.log(error)
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { msg: error.message })
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        msg: "Email or username are already in use. ",
      })
    } else {
      next(error)
    }
  }
}