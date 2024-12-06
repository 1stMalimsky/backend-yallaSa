const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  caravanCatalog: { type: [String] },
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
