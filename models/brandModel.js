const mongoose = require("mongoose");
const brandSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
