// Imports
const express = require("express")
const app = express()
const cors = require("cors")

const connectDB = require("./config/db")
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

// Middlewares
require("dotenv").config()
connectDB()

app.use(cors())
app.use(express.json({ extended: true }))

// Routes

// stripe routes
app.use("/api/stripe", require("./routes/stripe.routes.js"))

app.use("/api/users", require("./routes/users.routes"))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/customers", require("./routes/customer.routes"))
app.use("/api/opportunities", require("./routes/opportunity.routes"))
app.use("/api/projects", require("./routes/project.routes"))
app.use("/api/orgs", require("./routes/org.routes"))
app.use("/api/contacts", require("./routes/contact.routes"))

app.post("/app/payment", async (req, res) => {
  let { amount, id } = req.body
  try {
    const payment = await stripe.paymentInents.create({
      amount,
      currency: "USD",
      description: "Spatula company",
      payment_method: id,
      confirm: true,
    })
  } catch (error) {}
})
// Server
app.listen(process.env.PORT, () => {
  console.log("Running on ", process.env.PORT)
})
