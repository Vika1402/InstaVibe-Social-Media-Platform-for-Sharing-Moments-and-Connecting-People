import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Link } from "react-router-dom";

function Messages({ selectedUser }) {
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
        {[1, 2, 3, 4, 5].map((msg) => (
          <div key={msg} className={`flex`}>
            <div className=" rounded-xl bg-gray-200 py-2 px-4">
              Message me aayaega na yaha msg{msg}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
