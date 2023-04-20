const express = require("express");
const {
  createTodo,
  updateTodoStatus,
  deleteTodo,
  updateTodo,
} = require("../controllers/todoControllers");

const router = express.Router();

router.post("/", createTodo);
router.post("/updatestatus", updateTodoStatus);
router.post("/delete", deleteTodo);
router.post("/update", updateTodo);

module.exports = router;
