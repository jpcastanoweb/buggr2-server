const { Schema, model } = require("mongoose")

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: 3,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin is required"],
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
      default: [],
    },
    opportunities: {
      type: [{ type: Schema.Types.ObjectId, ref: "Opportunity" }],
      default: [],
    },
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    customers: {
      type: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Organization = model("Organization", organizationSchema)

module.exports = Organization
