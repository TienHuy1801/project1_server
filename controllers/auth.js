const User = require("../models/user");
const Shop = require("../models/shop");
const Cart = require("../models/cart");
const Order = require("../models/order");
const bcrypt = require("bcrypt");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    !user && res.status(400).json("Không tìm thấy tài khoản");

    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("Sai mật khẩu");

    !user.verify &&
      res.status(400).json("Tài khoản chưa xác nhận");

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
    
    await sgMail.send({
      to: email,
      from: "tienhuy1801@gmail.com",
      subject: "Verify account!",
      html: `
      <p>Bạn nhận được yêu cầu xác nhận tài khoản</p>
      <p>Nhấn vào <a href="http://localhost:8080/auth/verify/${newUser._id}">link</a> để xác nhận tài khoản</p>
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

    res.status(200).json("Đăng ký thành công");
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
    !user && res.status(404).json("Không tìm thấy tài khoản");

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
    const email = req.body.email
    const user = await User.findOne({ email: email });
    !user && res.status(404).json("Email chưa được đăng ký");

    await sgMail.send({
      to: email,
      from: "tienhuy1801@gmail.com",
      subject: "Password reset!",
      html: `
      <p>Bạn nhận được yêu cầu đổi mật khẩu</p>
      <p>Nhấn vào <a href="http://localhost:3000/reset/${user._id}">link</a> để tạo mật khẩu mới</p>
    `,
    });
    res.status(201).json("Đã gửi yêu cầu đổi mật khẩu");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postChangePassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const password = req.body.password;
    const user = await User.findOne({ _id: userId });
    !user && res.status(404).json("Email chưa được đăng ký");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.save();

    res.status(201).json("Đổi mật khẩu thành công");
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
    res.status(201).json("Xác thực thành công");
  } catch (err) {
    res.status(500).json(err);
  }
};
