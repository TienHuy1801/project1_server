const User = require("../models/user");
const Shop = require("../models/shop");
const Cart = require("../models/cart");
const Order = require("../models/order");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    !user && res.status(400).jsonp({ message: "Không tìm thấy tài khoản" });

    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).jsonp({ message: "Sai mật khẩu" });

    !user.verify &&
      res.status(400).jsonp({ message: "Tài khoản chưa xác nhận" });

    const userLogin = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      place: user.place,
      shopId: user.shopId,
      orderId: user.orderId,
      cartId: user.cartId,
    };

    req.user = userLogin;
    res.status(200).json(userLogin);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postRegister = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const place = req.body.place;

    const findUser = await User.findOne({ email: email });
    findUser && res.status(404).json("Email đã được sử dụng");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      fullName: fullName,
      place: place,
      shopId: null,
      orderId: null,
      cartId: null,
    });

    await transporter.sendMail({
      to: email,
      from: "tienhuycodeforces@gmail.com",
      subject: "Verify account!",
      html: `
      <p>You requested a verify account</p>
      <p>Click this <a href="http://localhost:8080/auth/verify/${newUser._id}">link</a> to verify account</p>
    `,
    });

    const shop = new Shop();
    await shop.save();
    newUser.shopId = shop._id;
    const order = new Order();
    await order.save();
    newUser.orderId = order._id;
    const cart = new Cart();
    await cart.save();
    newUser.cartId = cart._id;
    await newUser.save();

    const user = {
      id: newUser._id,
      email: email,
      fullName: fullName,
      place: place,
      shopId: shop._id,
      orderId: order._id,
      cartId: cart._id,
    };
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postEditProfile = async (req, res) => {
  try {
    const fullName = req.body.fullName;
    const place = req.body.place;
    const userId = req.body.userId;

    const user = await User.findOne({ _id: userId });
    !user && res.status(404).json({ message: "Không tìm thấy tài khoản" });

    user.fullName = fullName;
    user.place = place;
    await user.save();

    const userRes = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      place: user.place,
      shopId: user.shopId,
      orderId: user.orderId,
      cartId: user.cartId,
    };
    res.status(201).json(userRes);
  } catch (err) {
    req.status(500).json(err);
  }
};

exports.postResetRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("Email chưa được đăng ký");

    await transporter.sendMail({
      to: req.body.email,
      from: "tienhuycodeforces@gmail.com",
      subject: "Password reset!",
      html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset/${user._id}">link</a> to set a new password</p>
    `,
    });
    res.status(201).json({ message: "Đã gửi email thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postChangePassword = async (req, res) => {
  const userId = req.params.userId;
  const password = req.body.password;
  try {
    const user = await User.findOne({ _id: userId });
    !user && res.status(404).json("Email chưa được đăng ký");
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.save();

    res.status(201).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.verifyAcc = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId });
    !user && res.status(404).json("Email chưa được đăng ký");

    user.verify = true;
    user.save();
    res.status(201).json({ message: "Xác thực thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};
