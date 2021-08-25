const { Schema, model } = require("mongoose")

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required."],
      minLength: 3,
    },
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "belongsTo (org) is required."],
    },
    forCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "forCustomer (customer) is required"],
    },
    dollarValue: {
      type: Number,
      default: 0,
      required: [true, "Dollar Value is required"],
    },
    startDate: { type: Date, required: [true, "Open Date is required."] },
    dueDate: Date,
    wasOpp: { type: Boolean, default: false },
    oppOpenedDate: Date,
    oppClosedDate: Date,
    currentStage: {
      type: String,
      enum: [
        "Analysis",
        "Design",
        "Implementation",
        "Testing",
        "Delivered",
        "Maintenance",
      ],
      required: [true, "Stage is required."],
    },
    mainContact: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
    associatedContacts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
      default: [],
    },
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

const Project = model("Project", projectSchema)

module.exports = Project
