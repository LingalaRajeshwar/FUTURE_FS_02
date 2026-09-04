const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    source: {
      type: String,
      default: "Website"
    },

    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new"
    },

    notes: {
      type: String,
      default: ""
    },

    followUpDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lead", leadSchema);