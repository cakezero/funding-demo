import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user, authenticated, ready } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      navigate("/");
    }
  }, [ready, authenticated, navigate]);

  console.log({ ready1: ready, authenticated, user });

  const { login } = useLogin({
    onComplete: () => {
      try {
        toast.success("Login Sucsessfully!");
        console.log({ user: user?.wallet });
        navigate("/nft");
      } catch (error) {
        console.log(error);
        toast.error("Error logging in, please try again!");
      }
    },
  });

  return (
    <>
      <h1 className="text-center text-3xl font-bold text-black-500 mt-20">
        Login to customize NFT
      </h1>

      <div className="flex flex-col items-center justify-center mt-10">
        <button
          onClick={login}
          className="bg-blue-500 flex items-center mt-4 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
      <Toaster />
    </>
  );
}
