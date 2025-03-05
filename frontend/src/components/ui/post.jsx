import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaRegHeart } from "react-icons/fa";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Save,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
function Post({ post }) {
  const [open, setOpen] = useState(false);
  const [text, settext] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      settext(inputText);
    } else {
      settext("");
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1740940349301-d29d8c62e0f4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className=" cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit border-2  text-gray-800 font-normal"
            >
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit border-2 text-gray-800  font-normal"
            >
              Add To Favorites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit border-2  text-red-800  font-normal"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="mt-2 rounded-lg my-2 w-full  aspect-square  object-contain"
        src={post.image}
      />

      <div className="flex items-center  justify-between my-2 mt-2">
        <div className="flex items-center mx-3 gap-3">
          <FaRegHeart
            size={"24px"}
            cursor={"pointer"}
            className=" hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => setOpen(true)}
            className=" cursor-pointer hover:text-gray-600"
          />
          <Send cursor={"pointer"} className="hover:text-gray-600" />
        </div>
        {/* <FaHeart /> */}

        <Bookmark cursor={"pointer"} className="hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-2">{post.likes.length} likes</span>
      <p>
        <span className=" font-medium mr-2">{post.author.username}</span>
        {post?.caption}
      </p>
      <span className="text-gray-400" onClick={() => setOpen(true)}>
        View All {post.comments.length} Comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex justify-between mx-1">
        <input
          type="text"
          placeholder="Add a comments"
          className=" w-full outline-0 text-sm"
          onChange={changeEventHandler}
          value={text}
        />
        {text && (
          <span className="text-blue-600 bg-gray-100 rounded-sm ">Post</span>
        )}
      </div>
    </div>
  );
}

export default Post;
