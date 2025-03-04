import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

function Post() {
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" className="rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className=" cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit  text-gray-400 font-normal"
            >
              Unfollow
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Post;
