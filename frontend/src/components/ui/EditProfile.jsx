import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import axiosInstance from "@/utils/axiosInstant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileEvenetHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
    }
  };
  const selechChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };
  const editProfileHandler = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.profilePhoto) {
        formData.append("profilePicture", input.profilePhoto);
      }
      const res = await axiosInstance.post(
        "/api/user/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res?.data?.user?.bio,
          profilePicture: res?.data?.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex max-w-2xl justify-center mx-auto pl-10 mt-10">
      <section className="flex flex-col gap-6 w-full ">
        <h1 className="font-bold text-lg">Edit Profile</h1>
        <div className="flex items-center justify-between  bg-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex  justify-between gap-5 w-full">
              <Avatar>
                <AvatarImage className={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="">
                <h1 className=" font-bold text-sm">{user.username}</h1>
                <span className="text-gray-600 text-sm">
                  {user.bio ? user?.bio : "Bio here"}
                </span>
              </div>
            </div>
          </div>
          <input
            onChange={fileEvenetHandler}
            ref={imageRef}
            type="file"
            hidden
          />
          <Button
            onClick={() => imageRef?.current?.click()}
            className="bg-blue-400 hover:bg-blue-500"
          >
            change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-lg">Bio</h1>
          <Textarea
            value={input.bio}
            name="bio"
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-bold text-lg">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selechChangeHandler}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-ful bg-blue-500 hover:bg-blue-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait..
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-ful bg-blue-500 hover:bg-blue-400"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
