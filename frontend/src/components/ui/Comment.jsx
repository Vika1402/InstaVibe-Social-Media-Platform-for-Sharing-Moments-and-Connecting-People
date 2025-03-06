import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

function Comment({ comment }) {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>
          <span className="text-gray-600 text-md">
            {comment?.author?.username}
          </span>
          <span className=" font-normal pl-1 text-sm">{comment?.content}</span>
        </h1>
      </div>
    </div>
  );
}

export default Comment;
