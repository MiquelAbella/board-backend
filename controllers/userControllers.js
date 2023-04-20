const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

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
    const { userId, todos } = newUser;
    return res
      .status(200)
      .json({ ok: true, user: { email, fullName, userId, todos } });
  } catch (error) {
    console.log(error);
    res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body.user;

  try {
    const user = await User.findOne({ email: email }).populate("todos");
    console.log(user);

    if (!user) {
      res.status(503).json({
        ok: false,
        msg: "User and password do not match",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(503).json({
        ok: false,
        msg: "User and password do not match",
      });
    }

    res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error)
    res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createUser, loginUser };
