import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Textarea } from "./textarea";
import { readFileAsDataUrl } from "@/lib/utils";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstant";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  //console.log(user);
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    // console.log("Selected File:", file);
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePrev(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("caption", caption);
    if (imagePrev) {
      formData.append("image", file);
    }
    //console.log(formData);

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/post/add-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogTitle className="text-center font-medium text-lg">
          Create New Post
        </DialogTitle>

        <div onSubmit={createPostHandler} className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-gray-600 text-xs">
              {user?.username}
            </h1>
            <span className="font-semibold text-gray-400 text-xs">
              {user.bio ? user.bio : "Bio here.."}
            </span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption.."
          className="focus-visible:ring-transparent border-0"
        />

        {imagePrev && (
          <div className="w-full rounded-xl flex items-center justify-center">
            <img
              className="w-64 h-64 rounded-xl object-cover"
              src={imagePrev}
              alt="previewImage"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="w-full hidden"
          onChange={fileChangeHandler}
        />

        <button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-blue-400 rounded-sm px-4 py-2"
        >
          Select From Device
        </button>

        {imagePrev &&
          (loading ? (
            <Button>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button onClick={createPostHandler}>Post</Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
