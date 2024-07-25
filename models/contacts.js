const Contact = require("./contactsModel");

const listContacts = async (res) => {
  try {
    const contacts = await Contact.find({});

    res.status(200).json({
      status: "success",
      data: {
        contacts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getContactById = async (res, contactId) => {
  try {
    const contact = await Contact.findById(contactId);

    res.status(200).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const removeContact = async (res, contactId) => {
  try {
    await Contact.findByIdAndDelete(contactId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const addContact = async (res, body) => {
  try {
    const newContact = await Contact.create(body);

    res.status(200).json({
      status: "success",
      data: {
        contact: newContact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const updateContact = async (res, body, contactId) => {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const updateStatusContact = async (res, body, contactId) => {
  try {
    const { favorite } = body;
    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        status: "fail",
        message: "Favorite must be a boolean value (true or false).",
      });
    }

    const update = { $set: { favorite } };

    const contact = await Contact.findByIdAndUpdate(contactId, update, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
