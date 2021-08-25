const { Schema, model } = require("mongoose")

const noteSchema = new Schema({
  title: {
    type: String,
    required: [true, "Note's title is required"],
  },
  content: { type: String, default: "" },
  belongsTo: {
    type: Schema.Types.ObjectId,
    required: true,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `onModel` property to find the right model.
    refPath: "onModel",
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Customer", "Opportunity", "Project"],
  },
})

const Note = model("Note", noteSchema)

module.exports = Note
