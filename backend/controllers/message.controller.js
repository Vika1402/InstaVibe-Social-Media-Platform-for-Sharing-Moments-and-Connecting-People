import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    let { message } = req.body;
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, reciverId],
      },
    });

    //chat estabalish
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      reciverId,
      message,
    });

    if (newMessage) conversation.message.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    //implement socket io for real time chating

    return res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const conversation = await Conversation.find({
      participants: { $all: [senderId, reciverId] },
    });
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
