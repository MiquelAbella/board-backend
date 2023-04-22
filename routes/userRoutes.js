const express = require("express");
const {
  createUser,
  loginUser,
  createGoogleUser,
  loginGoogleUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/", createUser);
router.post("/googleregister", createGoogleUser);
router.post("/login", loginUser);
router.post("/googlelogin", loginGoogleUser);

module.exports = router;
