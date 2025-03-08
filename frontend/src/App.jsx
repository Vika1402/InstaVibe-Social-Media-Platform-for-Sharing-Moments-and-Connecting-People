import React, { useEffect } from "react";
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
import EditProfile from "./components/ui/EditProfile";
import ChatPage from "./components/ui/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";

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
        path: "/chatpage",
        element: <ChatPage />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/editprofile",
        element: <EditProfile />,
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
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:4000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
