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
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
    text: "Notification",
  },
  {
    icon: <PlusSquare />,
    text: "create",
  },
  {
    icon: (
      <Avatar>
        <AvatarImage
          className="w-8 h-8"
          src="https://media.istockphoto.com/id/1681388313/vector/cute-baby-panda-cartoon-on-white-background.jpg?s=1024x1024&w=is&k=20&c=Q7snaeFxLlgaiTHdobMD1gPnEgQtGst4Kflf7iiW1XU="
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
function LeftsideBar() {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.post("/api/user/logout");
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sidebarHandler = (texttType) => {
    if (texttType === "Logout") {
      logoutHandler();
    }
  };
  return (
    <div className="fixed top-0 left-0 px-4 z-10 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="text-xl font-bold">InstaVibe</h1>
        {sidebarItem.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="items-center gap-4 flex relative hover:bg-gray-100  cursor-pointer  rounded-lg p-3 my-3"
            >
              {item.icon} <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftsideBar;
