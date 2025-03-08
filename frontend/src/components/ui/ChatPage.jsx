import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./input";
import { Button } from "./button";
import { MessageCircle, MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axiosInstance from "@/utils/axiosInstant";
import { toast } from "sonner";
import { setMessages } from "@/redux/chatSlice";

function ChatPage() {
  const { onlineUsers } = useSelector((store) => store.chat);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { messages } = useSelector((store) => store.chat);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const sendMessageHandler = async (reciverId) => {
    try {
      const res = await axiosInstance.post(`/api/message/send/${reciverId}`, {
        message,
      });

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
        toast.success(res.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data?.response?.message);
    }
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div className="flex ml-[16%] h-screen">
      <section>
        <h1 className=" font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 " />
        <div className=" overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="gap-3 p-3 flex items-center hover:bg-gray-50"
              >
                <Avatar>
                  <AvatarImage src={suggestedUser.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-midium">{suggestedUser.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-1 border-l-gray-300 flex flex-col h-full justify-between">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex px-1 mb-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Messages..."
              className="flex-1 mr-2 focus-visible:ring-transparent "
              type="text"
            />
            <Button onClick={() => sendMessageHandler(selectedUser._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col justify-center items-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-midium text-xl">Your Message</h1>
          <span>Send a Message to Start a Chat </span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
