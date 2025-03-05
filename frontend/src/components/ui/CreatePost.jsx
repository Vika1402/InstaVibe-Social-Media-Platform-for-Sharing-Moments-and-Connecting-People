import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Textarea } from "./textarea";
import { readFileAsDataUrl } from "@/lib/utils";

function CreatePost({ open, setOpen }) {
  const createPostHandler = async () => {};
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const imageRef = useRef();
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePrev(dataUrl);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-medium text-lg">
          Create New Post
        </DialogHeader>
        <div onSubmit={createPostHandler} className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className=" font-semibold text-gray-600 text-xs">username</h1>
            <span className="font-semibold text-gray-400 text-xs">
              Bio here...
            </span>
          </div>
        </div>
        <Textarea
          placeholder="Write a caption.."
          className=" focus-visible:ring-transparent border-0 "
        ></Textarea>
        {imagePrev && (
          <div className="w-full  rounded-xl  flex items-center justify-center">
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
          hidden
          className="w-full"
          onChange={fileChangeHandler}
        />
        <button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-blue-400 rounded-sm px-4 py-2"
        >
          Select From Device
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
