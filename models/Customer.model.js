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
    mainContact: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
    contacts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
      default: [],
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
    notes: {
      type: [{ type: Schema.Types.ObjectId, ref: "Note" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Customer = model("Customer", customerSchema)

module.exports = Customer
