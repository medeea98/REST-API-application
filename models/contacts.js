const fs = require("fs/promises");

const listContacts = async () => {
  try {
    const file = await fs.readFile(`${__dirname}/contacts.json`, "utf-8");
    return JSON.parse(file);
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsList = await listContacts();
    const contact = contactsList.find((contact) => contact.id === contactId);

    return contact;
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId) => {
  try {
    let contactsList = await listContacts();

    const newList = contactsList.filter((contact) => contact.id !== contactId);

    await fs.writeFile(`${__dirname}/contacts.json`, JSON.stringify(newList));
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (body) => {
  try {
    let contactsList = await listContacts();

    const newContact = {
      id: String(contactsList.length + 1),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };

    contactsList.push(newContact);
    await fs.writeFile(
      `${__dirname}/contacts.json`,
      JSON.stringify(contactsList)
    );
    contactsList = await listContacts();

    return newContact;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, body) => {
  let contactsList = await listContacts();
  const [contact] = contactsList.filter((contact) => contact.id === contactId);
  await removeContact(contactId);
  contactsList = await listContacts();

  contact.name = body.name;
  contact.email = body.email;
  contact.phone = body.phone;

  contactsList.push(contact);
  await fs.writeFile(
    `${__dirname}/contacts.json`,
    JSON.stringify(contactsList)
  );

  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
