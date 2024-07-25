const Contact = require("./contactsModel");

const listContacts = async (
  userId,
  page = 1,
  limit = 20,
  favorite = null,
  res
) => {
  try {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;

    const skip = (pageNumber - 1) * pageSize;
    let filter = { owner: userId };
    if (favorite !== null) {
      filter.favorite = favorite === "true";
    }

    const contacts = await Contact.find(filter).skip(skip).limit(pageSize);

    const totalContacts = await Contact.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        contacts,
        total: totalContacts,
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getContactById = async (userId, res, contactId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner: userId });

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

const removeContact = async (userId, res, contactId) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: contactId,
      owner: userId,
    });

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "Contact not found",
      });
    }

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

const addContact = async (userId, res, body) => {
  try {
    const newContact = await Contact.create({ ...body, owner: userId });

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

const updateContact = async (userId, res, body, contactId) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

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

const updateStatusContact = async (userId, res, body, contactId) => {
  try {
    const { favorite } = body;
    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        status: "fail",
        message: "Favorite must be a boolean value (true or false).",
      });
    }

    const update = { $set: { favorite } };

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

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
