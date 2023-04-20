const { Schema, model } = require("mongoose");

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

module.exports = model("Todo", TodoSchema);
