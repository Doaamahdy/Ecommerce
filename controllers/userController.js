const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const { generateJWTToken } = require("../config/jwtToken"); // تأكدي إن الاستيراد صحيح
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const crypto = require("crypto");
const uniqid = require("uniqid");

// Create a User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateJWTToken(findUser._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email: email });
  if (findAdmin.role != "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin._id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      token: generateJWTToken(findAdmin._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refreshToken
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh Token Cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) throw new Error(`No Refresh Token in db or matched`);
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // console.log(user._id);
    // console.log(decoded.id);
    if (err || user._id.toString() !== decoded.id) {
      throw new Error("There is something wrong with refreshtoken");
    }
    console.log(decoded);
  });
  const accessToken = generateJWTToken(user._id);

  res.json({ accessToken });
});

// logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh Token Cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // firbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // firbidden
});

// Update user
const updateUser = asyncHandler(async (req, res, next) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  const { firstname, lastname, email, mobile } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        mobile,
        email,
      },
      {
        // return the updated Document
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

// Save User Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        address: req.body.address,
      },
      {
        new: true,
      }
    );

    res.json({ user });
  } catch (err) {
    throw new Error(err);
  }
});

// Get All User
const getAllUsers = asyncHandler(async (req, res, nex) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (err) {
    throw new Error(err);
  }
});

const getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getUser = await User.findById(id);
    res.json({ user: getUser });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json({ deletedUser });
  } catch (err) {
    throw new Error(err);
  }
});

const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
      }
    );
    res.json({ message: "user Blocked" });
  } catch (err) {
    throw new Error(err);
  }
});
const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: "user UnBlocked" });
  } catch (err) {
    throw new Error(err);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  const { password } = req.body;
  validateMongodbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json({
      messge: "same password",
    });
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("No User Found with this Email");
  try {
    const token = await user.createPasswordRestToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset password. This link is Valid till 10 minutes
   <a href=''>Click Here</a>`;
    const data = {
      to: email,
      subject: "Forgot Password Link",
      html: resetURL,
      text: "Hey User",
    };
    // sendEmail(data);
    res.json(token);
  } catch (err) {
    throw new Error(err);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  let user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token Expired. Please Try again later");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user = await user.save();
  res.json({
    user,
  });
});

const getWhishlist = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const user = await User.findById(id).populate("whishList");
    res.json({ user });
  } catch (err) {
    throw new Error(err);
  }
});

const userCart = asyncHandler(async (req, res, next) => {
  const { cart } = req.body;
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    let products = [];
    const user = await User.findById(id);
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      await Cart.deleteOne({ orderby: id });
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    console.log(products);
    let newCart = await Cart({
      products,
      cartTotal,
      orderby: id,
    }).save();
    res.json({ newCart });
  } catch (err) {
    throw new Error(err);
  }
});

const getUserCart = asyncHandler(async (req, res, next) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );
    res.json({ cart });
  } catch (err) {
    throw new Error(err);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const cart = await Cart.findOneAndDelete({ orderby: id });
    res.json({
      cart,
    });
  } catch (err) {
    throw new Error(err);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const validCoupon = await Coupon.findOne({
      name: coupon,
    });
    if (!validCoupon) {
      throw new Error("Invalid Coupon");
    }
    let { products, cartTotal } = await Cart.findOne({
      orderby: id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: id },
      {
        totalAfterDiscount,
      },
      {
        new: true,
      }
    );
    res.json({ totalAfterDiscount });
  } catch (err) {
    throw new Error(err);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id: id } = req.user;
  if (!COD) throw new Error("Create Cash Order failed");
  try {
    let userCart = await Cart.findOne({ orderby: id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
    let newOrder = await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: id,
      orderStatus: "Cash on Delivery",
    });
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (err) {
    throw new Error(err);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  validateMongodbId(id);
  try {
    const orders = await Order.find({ orderby: id })
      .populate("products.product")
      .exec();
    res.json({ orders });
  } catch (err) {
    throw new Error(err);
  }
});
const updateOrderSatuts = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json({ order });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWhishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderSatuts,
};
