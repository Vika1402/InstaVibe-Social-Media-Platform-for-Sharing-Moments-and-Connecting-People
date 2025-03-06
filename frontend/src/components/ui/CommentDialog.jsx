import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";

function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const { selectedPost } = useSelector((store) => store.post);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const sendCommentHandler = async () => {
    alert(text);
  };
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-5xl p-0 flex flex-col"
        onInteractOutside={() => setOpen(false)}
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className=" rounded-lg w-full  h-full  object-cover"
              src={selectedPost?.image}
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex  items-center justify-between">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>DP</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-sm font-semibold">
                    {selectedPost?.author?.username}
                  </Link>
                  <div>
                    <span className="text-gray-600 text-sm">
                      {selectedPost?.author?.bio || "bio here..."}
                    </span>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger>
                  <MoreHorizontal className=" cursor-pointer" />
                  <DialogContent>
                    <div className="cursor-pointer text-red-700 font-semibold">
                      Unfollow
                    </div>
                    <div>Add to Favorites</div>
                  </DialogContent>
                </DialogTrigger>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {selectedPost?.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  onChange={changeEventHandler}
                  value={text}
                  className="w-full outline-0 border-gray-300 p-2 rounded-xl"
                  type="text"
                  placeholder="Add a comment..."
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendCommentHandler}
                  variant={"outline"}
                >
                  send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
