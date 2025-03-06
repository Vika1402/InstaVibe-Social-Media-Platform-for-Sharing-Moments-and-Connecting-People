import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Code2 } from "lucide-react";

function Profile() {
  const params = useParams();
  let userId = params.id;
  useGetUserProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);
  console.log(userProfile);
  const isLogedInUserProfile = false;
  const isFollowing = false;

  const [activeTab, setActiveTab] = useState("posts");
  const handletaCheck = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex max-w-5xl justify-center pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span>{userProfile.username}</span>
                {isLogedInUserProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-400"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-400"
                    >
                      View archives
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-400"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8 ">
                      Unfolloow
                    </Button>
                    <Button variant="secondary" className="h-8  ">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="h-8 hover:bg-blue-500 bg-blue-400"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className=" font-semibold">
                    {userProfile?.posts.length}{" "}
                    <span className=" font-light">Post</span>
                  </p>
                  <p className=" font-semibold">
                    {userProfile?.following.length}{" "}
                    <span className=" font-light">following</span>
                  </p>
                  <p className=" font-semibold">
                    {userProfile?.followers.length}{" "}
                    <span className=" font-light">followers</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span>{userProfile.bio || "Bio here..."}</span>
                  <Badge className="w-fit" variant="secondary">
                    <AtSign />
                    <span className="pl-1"> {userProfile?.username}</span>
                  </Badge>
                  <span>
                    {" "}
                    <Code2 />
                    Hello I am vikas
                  </span>
                  <span>Learn with me</span>
                  <span>
                    Professinol we develeoper <Code2 />
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t bprder-t-gray-200">
          <div className="flex justify-center items-center gap-10 text-sm">
            <span
              onClick={() => handletaCheck("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handletaCheck("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
