const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const generateJWT = require("../helpers/generateJWT");

const createUser = async (req, res) => {
  const { user } = req.body;
  const { email, fullName, password, repPassword } = user;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }

    if (password !== repPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Passwords do not match",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      userId: uuidv4(),
      todos: [],
    });
    await newUser.save();
    const { userId, todos, _id } = newUser;
    const token = await generateJWT(_id);
    return res
      .status(200)
      .json({ ok: true, user: { email, fullName, userId, todos, _id, token } });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const createGoogleUser = async (req, res) => {
  const { user } = req.body;
  const { email, fullName } = user;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }

    const newUser = new User({
      email,
      fullName,
      userId: uuidv4(),
      todos: [],
    });

    await newUser.save();

    const { userId, todos, _id } = newUser;
    console.log(newUser)
    const token = await generateJWT(_id);
    return res
      .status(200)
      .json({ ok: true, user: { email, fullName, userId, todos, _id, token } });
  } catch (error) {
    console.log(error);
    res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const loginUser = async (req, res) => {
  const { email: loginEmail, password } = req.body.user;

  try {
    const user = await User.findOne({ email: loginEmail }).populate("todos");

    if (!user) {
      return res.status(503).json({
        ok: false,
        msg: "User and password do not match",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(503).json({
        ok: false,
        msg: "User and password do not match",
      });
    }

    const token = await generateJWT(user._id);

    const { email, fullName, userId, todos, _id } = user;

    return res.status(200).json({
      ok: true,
      user: { email, fullName, userId, todos, _id, token },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};
const loginGoogleUser = async (req, res) => {
  const loginEmail = req.body.user;

  try {
    const user = await User.findOne({ email: loginEmail }).populate("todos");

    if (!user) {
      return res.status(503).json({
        ok: false,
        msg: "User and password do not match",
      });
    }

    const { email, fullName, todos, _id } = user;
    const token = await generateJWT(_id);
    return res.status(200).json({
      ok: true,
      user: { email, fullName, todos, _id, token },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createUser, loginUser, createGoogleUser, loginGoogleUser };
