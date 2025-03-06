import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import { useGetAllPost } from "@/hooks/useGetAllPost";
import { useGetAllSuggestedUsers } from "@/hooks/useGetSuggestedUser";

function Home() {
  useGetAllPost();
  useGetAllSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;
