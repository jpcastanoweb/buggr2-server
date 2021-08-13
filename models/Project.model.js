const { Schema, model } = require("mongoose")

function toDollarString(val) {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  return formatter.format(val)
}

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
    posts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Post" }],
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
  },
  {
    timestamps: true,
  }
)

const Project = model("Project", projectSchema)

module.exports = Project
