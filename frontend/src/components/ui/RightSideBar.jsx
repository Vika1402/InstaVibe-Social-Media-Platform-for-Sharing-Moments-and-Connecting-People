import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

function RightSideBar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-4 ">
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage className={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="">
          <h1 className=" font-semibold text-sm">{user.username}</h1>
          <span className="text-gray-700 text-sm">
            {user.bio ? user?.bio : "Bio here"}
          </span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  );
}

export default RightSideBar;
