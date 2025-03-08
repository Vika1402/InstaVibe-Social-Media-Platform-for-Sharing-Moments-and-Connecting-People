import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const { message } = req.body;

    console.log(req.body); // Debugging
    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    // Establish chat if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      reciverId,
      message: message.trim(),
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
      await conversation.save();
    }

    // Real-time chat with Socket.IO
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("message");
    if (!conversation) {
      return res.status(200).json({ messages: [], success: true });
    }
    return res
      .status(200)
      .json({ success: true, messages: conversation?.message });
  } catch (error) {
    console.log(error);
  }
};

export { sendMessage, getMessage };
