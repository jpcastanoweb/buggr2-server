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
      res.status(500).json(error)
    } else if (error.code === 11000) {
      res.status(500).json(error)
    } else {
      next(error)
    }
  }
}

exports.updateUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const { userId, user } = req.body

    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    })

    return res.json(updatedUser)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.updateAccountInfo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const { email } = req.body
    const { userid } = req.params
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { email },
      { new: true }
    )

    res.json(updatedUser)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.updateProfileInfo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array(),
    })
  }

  try {
    const { firstName, lastName } = req.body
    const { userid } = req.params

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { firstName, lastName },
      { new: true }
    )
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.updateSubscription = async (req, res) => {
  const { subscription } = req.body
  const { userid } = req.params
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      {
        subscription,
        subscriptionStatus: subscription.status,
      },
      { new: true }
    )
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json(error)
  }
}
