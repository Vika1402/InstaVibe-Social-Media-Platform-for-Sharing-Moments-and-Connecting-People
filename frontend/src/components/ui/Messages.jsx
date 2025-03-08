import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllMessages } from "@/hooks/useGetAllMessage";
import { useRealTimeMessage } from "@/hooks/useRealTimeMessage";

function Messages({ selectedUser }) {
  useGetAllMessages();
  useRealTimeMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className=" overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex items-center justify-center flex-col">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`/profile/${selectedUser._id}`}>
            <Button variant="secondary" className="h-8 my-2 ">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : " justify-start"
              }`}
            >
              <div
                className={`rounded-lg py-2 px-4 max-w-xs ${
                  msg.senderId === user?._id
                    ? " bg-blue-500 text-white "
                    : "bg-gray-200 text-black "
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Messages;
