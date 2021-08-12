const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.verifyingToken = async (req, res) => {
  const userId = req.user.id
  try {
    const userFound = await User.findById(userId).select("-password")
    res.json({
      userFound,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.loginUser = async (req, res) => {
  console.log("Hello")
  const { email, password } = req.body

  try {
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      res.status(400).json({
        msg: "User doesn't exist",
      })
    }

    console.log("password", password)
    console.log("foundUser", foundUser)

    const passCorrect = await bcryptjs.compare(password, foundUser.password)

    console.log("passCorrect", passCorrect)

    if (!passCorrect) {
      return res.status(400).json({
        msg: "Password is incorrect",
      })
    }

    const payload = {
      user: {
        id: foundUser.id,
      },
    }

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000,
      },
      (error, token) => {
        if (error) throw error

        res.json({
          token,
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
}
