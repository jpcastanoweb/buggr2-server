const express = require("express")
const router = express.Router()

const orgController = require("./../controllers/org.controller")

router.get("/:orgId", orgController.getSingleOrg)

module.exports = router
