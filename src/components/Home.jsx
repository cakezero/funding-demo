import { useLogin } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Home () {

    const navigate = useNavigate();

    const { login } = useLogin({
        onComplete: () => {
            try {
                toast.success("Login Sucsessfully!")
                navigate('/nft')
            } catch (error) {
                console.log(error)
                toast.error("Error logging in, please try again!")
            }
            
        }
    })

    return (
        <>
            <p className="bold">balance: 0.0</p>
            <h2>Login to customise your NFT</h2>

            <button onClick={login}>Login</button>
            <Toaster />
        </>
    )
}
