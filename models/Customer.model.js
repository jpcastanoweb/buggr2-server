const { Schema, model } = require("mongoose")

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required."],
    },
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "belongsTo (org) is required."],
    },
    contactInfo: {
      firstName: {
        type: String,
        // required: [true, "Contact First Name is required."],
      },
      lastName: {
        type: String,
        // required: [true, "Contact Last Name is required."],
      },
      emailAddress: {
        type: String,
        // required: [true, "Contact Email Address is required."],
      },
      phoneNumber: String,
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
      default: [],
    },
    opportunities: {
      type: [{ type: Schema.Types.ObjectId, ref: "Opportunity" }],
      default: [],
    },
    customerAddress: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      country: String,
    },
    customerPhoneNumber: String,
    customerEmailAddress: String,
    documents: {
      type: [
        {
          name: String,
          fileType: String,
          docUrl: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Customer = model("Customer", customerSchema)

module.exports = Customer
