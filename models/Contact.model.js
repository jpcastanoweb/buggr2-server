const { Schema, model } = require("mongoose")

const contactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Contact's first name is required."],
    },
    lastName: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      required: [true, "Contact's email is required"],
    },
    phoneNumber: String,
  },
  {
    timestamps: true,
  }
)

const Contact = model("Contact", contactSchema)

module.exports = User
