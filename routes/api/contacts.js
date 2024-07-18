const express = require("express");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", (req, res) => {
  listContacts(res);
});

router.get("/:contactId", (req, res) => {
  getContactById(res, req.params.contactId);
});

router.post("/", (req, res) => {
  addContact(res, req.body);
});

router.delete("/:contactId", (req, res) => {
  removeContact(res, req.params.contactId);
});

router.put("/:contactId", (req, res) => {
  updateContact(res, req.body, req.params.contactId);
});

router.patch("/:contactId/favorite", (req, res) => {
  updateStatusContact(res, req.body, req.params.contactId);
});

module.exports = router;
