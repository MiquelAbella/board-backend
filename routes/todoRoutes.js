const express = require("express");
const {
  createTodo,
  updateTodoStatus,
  deleteTodo,
  updateTodo,
} = require("../controllers/todoControllers");
const checkJWT = require("../middlewares/checkJWT");

const router = express.Router();

router.post("/", checkJWT, createTodo);
router.post("/updatestatus", checkJWT, updateTodoStatus);
router.post("/delete", checkJWT, deleteTodo);
router.post("/update", checkJWT, updateTodo);

module.exports = router;
