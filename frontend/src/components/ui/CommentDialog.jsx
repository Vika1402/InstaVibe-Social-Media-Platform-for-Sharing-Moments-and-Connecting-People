import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import axiosInstance from "@/utils/axiosInstant";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";

function CommentDialog({ open, setOpen }) {
  const [content, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axiosInstance.post(
        `/api/post/comment/${selectedPost._id}`,
        {
          content,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
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
              {comment?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  onChange={changeEventHandler}
                  value={content}
                  className="w-full outline-0 border-gray-300 p-2 rounded-xl"
                  type="text"
                  placeholder="Add a comment..."
                />
                <Button
                  onClick={commentHandler}
                  disabled={!content.trim()}
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
