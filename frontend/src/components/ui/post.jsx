import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import axiosInstance from "@/utils/axiosInstant";

import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./badge";

function Post({ post }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setContent(inputText);
    } else {
      setContent("");
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axiosInstance.post(
        `/api/post/delete-post/${post._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setOpen(false);
    }
  };
  const postSavedHandler = async () => {
    try {
      const res = await axiosInstance.get(`/api/post/saved-post/${post?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const LikeAnsDislikeHAndler = async (postId) => {
    const action = liked ? "dislike" : "like";
    try {
      const res = await axiosInstance.post(`/api/post/${action}/${postId}`);

      if (res.data?.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        //post update for instant like ddislike notify
        const updatedPostData = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axiosInstance.post(`/api/post/comment/${post._id}`, {
        content,
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setContent("");
      }
    } catch (error) {
      console.log(error);
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
          <div className="flex items-center gap-3">
            <h1>{post.author.username}</h1>
            {user._id === post.author._id && <Badge>Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className=" cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit border-2  text-gray-800 font-normal"
              >
                Unfollow
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit border-2 text-gray-800  font-normal"
            >
              Add To Favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit border-2  text-red-800  font-normal"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="mt-2 rounded-lg my-2 w-full  aspect-square  object-contain"
        src={post.image}
      />

      <div className="flex items-center  justify-between my-2 mt-2">
        <div className="flex items-center mx-3 gap-3">
          {liked ? (
            <FaHeart
              onClick={() => LikeAnsDislikeHAndler(post._id)}
              size={"24px"}
              cursor={"pointer"}
              className="text-red-600 "
            />
          ) : (
            <FaRegHeart
              onClick={() => LikeAnsDislikeHAndler(post._id)}
              size={"24px"}
              cursor={"pointer"}
              className=" hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className=" cursor-pointer hover:text-gray-600"
          />
          <Send cursor={"pointer"} className="hover:text-gray-600" />
        </div>

        <Bookmark
          onClick={postSavedHandler}
          cursor={"pointer"}
          className="hover:text-gray-600"
        />
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className=" font-medium mr-2">{post.author.username}</span>
        {post?.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-gray-400"
        >
          View All {post.comments.length} Comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex justify-between mx-1">
        <input
          type="text"
          placeholder="Add a comments"
          className=" w-full outline-0 text-sm"
          onChange={changeEventHandler}
          value={content}
        />
        {content && (
          <span
            onClick={() => commentHandler(post._id)}
            className="text-blue-600 bg-gray-100 rounded-sm cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
