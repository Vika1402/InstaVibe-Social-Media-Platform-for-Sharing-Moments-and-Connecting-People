import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.schema.types.ObjectId,
    ref: "User",
  },
  reciverId: {
    type: mongoose.schema.types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

export { Message };
