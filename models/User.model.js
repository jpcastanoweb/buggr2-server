const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email is already in use."],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
      minLength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.",
      ],
    },
    pictureURL: String,
    firstName: {
      type: String,
      required: [true, "First Name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required."],
    },
    role: {
      type: String,
      default: "",
    },
    organizations: {
      type: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const User = model("User", userSchema)

module.exports = User
