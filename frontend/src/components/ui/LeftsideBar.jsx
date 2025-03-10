import { setAuthUser } from "@/redux/authSlice";
import store from "@/redux/store";
import axiosInstance from "@/utils/axiosInstant";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageSquare,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent } from "./popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./button";

function LeftsideBar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.post("/api/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        setSelectedPost(null);
        dispatch(setPosts(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    }
    if (textType === "Create") {
      setOpen(true);
    }
    if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    }
    if (textType === "Home") {
      navigate("/");
    }
    if (textType === "message") {
      navigate("/chatpage");
    }
  };
  const sidebarItem = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "explore",
    },
    {
      icon: <MessageSquare />,
      text: "message",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage
            className="w-8 h-8 rounded-full"
            src={user?.profilePicture}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];
  return (
    <div className="fixed top-0 left-0 px-4 z-10 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="text-xl font-bold my-8 pl-3">InstaVibe</h1>
        <div>
          {sidebarItem.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className="items-center gap-4 flex relative hover:bg-gray-100  cursor-pointer  rounded-lg p-3 my-3"
              >
                {item.icon} <span>{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div>
                          <Button
                            className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600"
                            size="icon"
                          >
                            {likeNotification.length}
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div key={notification.userId}>
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification?.userDetails
                                          ?.profilePicture
                                      }
                                    />
                                  </Avatar>
                                  <p className="text-sm ">
                                    <span>
                                      {notification?.userDetails?.username}
                                      Liked your Post{" "}
                                    </span>
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftsideBar;
