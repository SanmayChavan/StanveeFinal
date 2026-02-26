import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setShowUserLogin, axios, navigate, syncUser } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload =
        state === "login" ? { email, password } : { name, email, password };

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data.success) {
        // Success toast
        toast.success(state === "login" ? "Login Successful!" : "Account Created!");

        // Close login modal
        setShowUserLogin(false);

        // Sync all user data (wallet, cart, user info) instantly
        await syncUser();

        // Navigate after sync
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 w-80 sm:w-[352px] p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name field only for register */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          />
        </div>

        {/* Toggle login/register */}
        <p className="text-sm text-gray-500">
          {state === "login"
            ? "Create an account?"
            : "Already have an account?"}{" "}
          <span
            onClick={() => setState(state === "login" ? "register" : "login")}
            className="text-primary cursor-pointer"
          >
            Click here
          </span>
        </p>

        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
