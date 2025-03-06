import React from "react";
import Signup from "./components/ui/Signup";
import { Button } from "./components/ui/button";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./components/ui/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/ui/Home";
import Profile from "./components/Profile";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
