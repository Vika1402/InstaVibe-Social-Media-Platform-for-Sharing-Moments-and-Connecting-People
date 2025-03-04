import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";

function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
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
              src="https://images.unsplash.com/photo-1740940349301-d29d8c62e0f4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex  items-center justify-between">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1740940349301-d29d8c62e0f4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D" />
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-sm font-semibold">username</Link>
                  {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
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
              comments shower
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
