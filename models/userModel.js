const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type:String
    },
    whishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordRestToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // we are storing the hashed token cause if some can access out database in some
  // we ensure that he cannot access the real token which more secure
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 10 minutes
  this.passwordResetExpires = Date.now() + 30 * 60 * 100;
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
