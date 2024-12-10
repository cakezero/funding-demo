import { useFundWallet, useWallets, usePrivy } from "@privy-io/react-auth";
import { DownloadButton, SendButton } from "../js/icons";
import { ethers } from "ethers";
import abi from "../js/abi.json";
import { useEffect, useState } from "react";
import { USDC_TEST } from "../js/constants";

const Balance = ({ close }) => {
  const [balance, setBalance] = useState(0);

  const { user, ready } = usePrivy();
  const { fundWallet } = useFundWallet();
  const { wallets } = useWallets();

  const fund = async () => {
    await fundWallet(user?.wallet.address);
  };

  
  useEffect(() => {
    const switchChain = async () => {
      const wallet = wallets[0];
      await wallet.switchChain(84532);
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      return { provider, signer };
    };

    const getBalance = async () => {
      const walletProp = await switchChain();
      const contract = new ethers.Contract(USDC_TEST, abi, walletProp.provider);
      const bal =
        (await contract.balanceOf(
          await walletProp.signer.getAddress()
        )) / BigInt(10 ** 6);
      const finBal = bal.toString();
      setBalance(finBal);
    };
    getBalance();
  }, [ready, wallets]);

  // Function to handle Send button click
  const handleSend = () => {
    console.log("Send button clicked");
  };

  return (
    <div className="fixed backdrop-blur-sm inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      {/* Modal Content */}
      <div className="mt-10 flex flex-col gap-5 text-white">
        <button onClick={close} className="place-self-end">
          ✖
        </button>
        <div className="bg-black p-6 rounded-2xl shadow-lg w-96 h-96">
          <h1 className="text-3xl text-center font-semibold mt-2 mb-9">
            $ {balance} USDC
          </h1>

          <div className="flex justify-between">
            {/* Send Button */}
            <button
              onClick={handleSend}
              className="bg-green-500 flex justify-center items-center text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
            >
              <SendButton /> <span className="ml-1">Send</span>
            </button>

            {/* Receive Button */}
            <button
              onClick={fund}
              className="bg-blue-500 flex text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              <DownloadButton /> <span className="ml-1">Receive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
