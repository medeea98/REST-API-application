const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");

const router = express.Router();

const itemsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": `Phone number must have 10 digits and only numbers.`,
    })
    .required(),
});

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({
    data: {
      contacts,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    res.status(404).json({
      message: "Not Found",
    });
  } else {
    res.status(200).json({
      contact,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { error } = itemsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const newContact = await addContact(req.body);
  res.status(201).json({
    id: {
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
    },
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return res.status(404).json({
      message: "Not Found",
    });
  }

  await removeContact(req.params.contactId);
  res.status(200).json({
    message: "contact deleted",
  });
});

router.put("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return res.status(404).json({
      message: "Not Found",
    });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "missing fields",
    });
  }

  const { error } = itemsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const response = await updateContact(req.params.contactId, req.body);

  res.status(200).json({
    contact: response,
  });
});

module.exports = router;
