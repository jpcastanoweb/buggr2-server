const mongoose = require("mongoose")

const Organization = require("./../models/Organization.model")

exports.getSingleOrg = async (req, res) => {
  const { orgId } = req.params

  try {
    const org = await Organization.findById(orgId)
      .populate("customers")
      .populate("projects")
      .populate("opportunities")

    if (!org) {
      res.status(400).json({ msg: "Organization not found" })
    }
    return res.json(org)
  } catch (error) {
    console.log("Error loading org", error.msg)
  }
}
