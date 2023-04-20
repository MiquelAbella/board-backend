const mongoose = require("mongoose");
const Todo = require("../models/Todo");
const User = require("../models/User");

const createTodo = async (req, res) => {
  const { todo, userId } = req.body;

  if (!todo || !userId) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }

  try {
    const newTodo = new Todo({
      text: todo,
      status: "pending",
      owner: userId,
    });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { todos: newTodo } },
      { new: true }
    );

    if (!user) {
      return res.status(503).json({
        ok: false,
        msg: "Something happened",
      });
    }

    await newTodo.save();

    const userResponse = await user.populate("todos");

    return res.status(201).json({
      ok: true,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const updateTodoStatus = async (req, res) => {
  const { todo, status, userId } = req.body;
  try {
    await Todo.findOneAndUpdate(
      { _id: todo._id },
      { status: status },
      { new: true }
    );
    const user = await User.findOne({ _id: userId }).populate("todos");
    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const deleteTodo = async (req, res) => {
  const { todo, userId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Todo.findByIdAndDelete(todo._id).session(session);

    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(503).json({
        ok: false,
        msg: "User not found",
      });
    }

    user.todos.pull(todo._id);
    await user.save();

    await session.commitTransaction();
    session.endSession();
    const updatedUser = await user.populate("todos");

    return res.status(200).json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const updateTodo = async (req, res) => {
  const { todo, todoId, userId } = req.body;
  try {
    await Todo.findByIdAndUpdate(todoId, { text: todo }, { new: true });
    const user = await User.findById(userId).populate("todos");
    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createTodo, updateTodoStatus, deleteTodo, updateTodo };
