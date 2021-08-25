const express = require("express")
const router = express.Router()

const { check } = require("express-validator")
const noteController = require("./../controllers/note.controller")

// --- CREATE NOTE
router.post(
  "/addnote",
  [
    check("title", "Note title is required.").notEmpty(),
    check("onModel", "Owner model type is required.").notEmpty(),
    check("ownerid", "Owner id is required.").notEmpty(),
  ],
  noteController.createNote
)

// --- UPDATE NOTE
router.post(
  "/:noteid/updatenote",
  [check("title", "Note title is required.").notEmpty()],
  noteController.updateNote
)

module.exports = router
