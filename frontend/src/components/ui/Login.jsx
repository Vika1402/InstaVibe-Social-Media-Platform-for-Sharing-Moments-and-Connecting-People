import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axiosInstance from "@/utils/axiosInstant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const naviagte = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const LoginHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/user/login", input);

      if (res.data.success) {
        console.log(res.data);
        toast.success(res.data.message);
        naviagte("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setInput({ email: "", password: "" });
      //console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={LoginHandler}
        className="shadow-lg gap-5 flex flex-col p-8"
      >
        <div className="my-4">
          <h1 className="text-center text-xl font-bold mb-4">InstaVibe</h1>
          <p className="text-center text-sm">
            Sign up to enjoy instavibe with you friends
          </p>
        </div>

        <div>
          <Label className="font-medium text-lg py-2">Email</Label>
          <Input
            value={input.email}
            onChange={changeEventHandler}
            type="text"
            name="email"
            className=" focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium text-lg py-2">Password</Label>
          <Input
            value={input.password}
            onChange={changeEventHandler}
            type="password"
            name="password"
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </Button>
        ) : (
          <Button>Login</Button>
        )}

        <p>
          Don't have an account?{" "}
          <span
            onClick={() => naviagte("/signup")}
            className="text-blue-500 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
