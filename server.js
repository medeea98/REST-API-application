const app = require("./app");
const mongoose = require("mongoose");

const URL =
  "mongodb+srv://medeea:parola@cluster0.rntxdlp.mongodb.net/db-contacts";

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection succesful"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
