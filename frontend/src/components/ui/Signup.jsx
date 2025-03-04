import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axiosInstance from "@/utils/axiosInstant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/user/register", input);

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ email: "", password: "", username: "" });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      //console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg gap-5 flex flex-col p-8"
      >
        <div className="my-4">
          <h1 className="text-center text-xl font-bold mb-4">InstaVibe</h1>
          <p className="text-center text-sm">
            Sign up to enjoy instavibe with you friends
          </p>
        </div>
        <div>
          <Label className="font-medium text-lg py-2">Username</Label>
          <Input
            value={input.username}
            onChange={changeEventHandler}
            type="text"
            name="username"
            className=" focus-visible:ring-transparent my-2"
          />
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
          <Button>Sign Up</Button>
        )}
        <p>
          Have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            {" "}
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
