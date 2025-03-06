import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";

function SuggestedUser() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between gap-4 text-sm">
        <h1 className=" text-gray-600">Suggested For You</h1>
        <span className=" font-semibold">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div
            key={user._id}
            className="mt-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-4 ">
                <Link to={`/profile/${user?._id}`}>
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
                <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-500">
                  Follow
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUser;
