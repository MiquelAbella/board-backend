const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkJWT = async (req, res, next) => {
  const token = req.headers["x-token"];

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No token in request",
    });
  }

  try {
    const { id } = jwt.verify(token, "makejdh38dh38hfjksjdh");
    console.log(id);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Invalid token",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Not valid token",
    });
  }
};

module.exports = checkJWT;
