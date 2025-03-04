import { Outdent } from "lucide-react";
import React from "react";
import { Outlet } from "react-router-dom";
import LeftsideBar from "./ui/LeftsideBar";

function MainLayout() {
  return (
    <div>
      <LeftsideBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
