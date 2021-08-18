// Imports
const express = require("express")
const app = express()
const cors = require("cors")

const connectDB = require("./config/db")

// Middlewares
require("dotenv").config()
connectDB()

app.use(cors())

app.use(express.json({ extended: true }))

// Routes

app.use("/api/users", require("./routes/users.routes"))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/customers", require("./routes/customer.routes"))
app.use("/api/opportunities", require("./routes/opportunity.routes"))
app.use("/api/projects", require("./routes/project.routes"))
app.use("/api/orgs", require("./routes/org.routes"))
app.use("/api/contacts", require("./routes/contact.routes"))

// Server
app.listen(process.env.PORT, () => {
  console.log("Running on ", process.env.PORT)
})
