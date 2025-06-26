// const mongoose = require("mongoose");

// const ProfileSchema = new mongoose.Schema({
//   profilePhotoUrl: String,
//   username: String,
//   currentPassword: String,
//   newPassword: String,
//   profession: String,
//   companyName: String,
//   designation: String,
//   addressLine1: String,
//   country: String,
//   state: String,
//   city: String,
//   subscription: String,
//   newsletter: Boolean,
// });

// module.exports = mongoose.model("Profile", ProfileSchema);

const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    profilePhotoUrl: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    currentPassword: {
      type: String,
      required: function () {
        return this.newPassword;
      },
    },
    newPassword: {
      type: String,
      required: function () {
        return this.currentPassword;
      },
    },
    profession: {
      type: String,
      required: true,
      enum: ["Student", "Developer", "Entrepreneur", "Employed"],
    },
    companyName: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    addressLine1: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: ["Basic", "Pro", "Enterprise"],
      default: "Basic",
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
