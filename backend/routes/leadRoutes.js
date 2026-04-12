const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// GET all leads
router.get("/", async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// CREATE lead
router.post("/", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.status(201).json(lead);
});

// UPDATE STATUS
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(lead);
});

// ADD NOTE
router.post("/:id/notes", async (req, res) => {
  const { text } = req.body;

  const lead = await Lead.findById(req.params.id);
  lead.notes.push({ text });

  await lead.save();

  res.json(lead);
});

module.exports = router;