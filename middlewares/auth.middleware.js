// This file will help decrypt the token

const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token")

  if (!token) {
    return res.status(401).json({
      msg: "There's no token. Permission not valid",
    })
  }

  try {
    const openToken = await jwt.verify(token, process.env.SECRET)
    req.user = openToken.user
    next()
  } catch (error) {}
}
