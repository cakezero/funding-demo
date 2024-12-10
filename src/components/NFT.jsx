import { useState, useEffect, useRef } from "react";
import Balance from "./Balance";
import {
  useWallets,
  useSendTransaction,
  useFundWallet,
  usePrivy,
} from "@privy-io/react-auth";
import { ethers } from "ethers";
import { USDC_TEST } from "../js/constants";
import abi from "../js/abi.json";
import { Spinner } from "../js/icons";

const ImageEditor = () => {
  const [pfpImage, setPfpImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [overlayScale, setOverlayScale] = useState(0.2); // Scale factor for the overlay image
  const canvasRef = useRef(null);
  const canvasWidth = 400;
  const canvasHeight = 400; // Fixed canvas size (800x800)
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const { user, ready } = usePrivy();
  const { sendTransaction } = useSendTransaction();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const fund = async () => {
    await fundWallet(user?.wallet.address);
  };

  useEffect(() => {
    const switchChain = async () => {
      const wallet = wallets[0];
      console.log({ wallets });
      console.log({ wallet, ready, user });
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      return { provider, signer };
    };

    const getBalance = async () => {
      const walletProp = await switchChain();
      const contract = new ethers.Contract(USDC_TEST, abi, walletProp.provider);
      const bal =
        (await contract.balanceOf(await walletProp.signer.getAddress())) /
        BigInt(10 ** 6);
      const finBal = bal.toString();
      setBalance(finBal);
    };
    getBalance();
  }, [ready, wallets]);

  const payFee = async () => {
    setLoading(true);
    const switchChain = async () => {
      const wallet = wallets[0];
      await wallet.switchChain(84532);
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      return { provider, signer };
    };
    const amountInUSDC = "1";
    const recieverAddy = "0x141c7330bDa4885fb9e61f3745225Db62CDB00C4";

    const amountInDecimal = ethers.parseUnits(amountInUSDC, 6);
    // console.log({amountInDecimal})
    try {
      const walletProp = await switchChain();

      const usdcContract = new ethers.Contract(
        USDC_TEST,
        abi,
        walletProp.provider
      );
      const transferData = usdcContract.interface.encodeFunctionData(
        "transfer",
        [recieverAddy, amountInDecimal]
      );

      const txData = {
        to: USDC_TEST,
        value: 0,
        data: transferData,
      };

      const tx = await sendTransaction(txData);

      // const tx = await walletProp.signer.sendTransaction(txData)
      // const receipt = await tx.wait(1);

      console.log({ tx: tx.transactionHash });
      setLoading(false);

      downloadImage();
    } catch (error) {
      console.error({ error });
      setLoading(false);
    }
  };

  // Handle image upload (pfp photo)
  const handlePfpImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setPfpImage(img);
        drawOnCanvas(img); // Draw the pfp image on canvas
      };
    }
  };

  // Handle overlay image (mug or beanie)
  const handleOverlayChange = (overlayType) => {
    const img = new Image();
    let imagePath = "";

    // Choose image based on the overlay type (mug or beanie)
    if (overlayType === "mug") {
      imagePath = "images/image.png"; // Replace with actual mug image path
    } else if (overlayType === "beanie") {
      imagePath = "/images/cup png.png"; // Replace with actual beanie image path
    }

    img.src = imagePath;
    img.onload = () => {
      setOverlayImage(img); // Set overlay image to the selected one

      // Calculate scale factor for overlay image
      const scaleFactor = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      );

      // Set the overlay to be centered on the canvas
      setOverlayPosition({
        x: (canvasWidth - img.width * scaleFactor) / 2,
        y: (canvasHeight - img.height * scaleFactor) / 2,
      });

      // Set the overlay scale dynamically based on the canvas size
      setOverlayScale(scaleFactor);

      drawOnCanvas(pfpImage); // Redraw the pfp image with overlay
    };
  };

  // Draw images on canvas
  const drawOnCanvas = (pfpImg) => {
    if (!pfpImg) return; // If no pfp image, do nothing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvasWidth; // Fixed canvas width (400x400)
    canvas.height = canvasHeight; // Fixed canvas height (400x400)

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Scale the pfp image to fit within the 400x400 canvas size
    const scale = Math.min(
      canvasWidth / pfpImg.width,
      canvasHeight / pfpImg.height
    );
    const x = (canvasWidth - pfpImg.width * scale) / 2; // Center horizontally
    const y = (canvasHeight - pfpImg.height * scale) / 2; // Center vertically
    ctx.drawImage(pfpImg, x, y, pfpImg.width * scale, pfpImg.height * scale); // Draw the scaled pfp image

    if (overlayImage) {
      // Calculate overlay image position with scaling factor applied
      const overlayWidth = overlayImage.width * overlayScale;
      const overlayHeight = overlayImage.height * overlayScale;

      // Draw the overlay image with adjusted position and scale
      ctx.drawImage(
        overlayImage,
        overlayPosition.x,
        overlayPosition.y,
        overlayWidth, // Scaled width
        overlayHeight // Scaled height
      );
    }
  };

  // Download the edited image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "pfp.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex place-self-end">
        <button
          onClick={openModal}
          className="bg-blue-500 flex justify-center mr-1 items-center text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition text-xl font-bold"
        >
          Balance: {balance} USDC
        </button>
      </div>
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        Upload and Edit Image
      </h3>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePfpImageChange}
        className="mb-4"
      />

      {/* Overlay buttons to add mug or beanie */}
      {pfpImage && (
        <div className="mb-4 flex flex-row gap-4">
          <button onClick={() => handleOverlayChange("beanie")}>
            <img
              src="/images/cup png.png" // Placeholder for beanie image
              alt="cup"
              className="cursor-pointer w-28 h-28 border-4 border-gray-500 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            />
          </button>
        </div>
      )}

      {/* Canvas to display image and overlay */}
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #000", cursor: "pointer" }}
      />

      {/* Download Button */}
      {balance >= 1 && pfpImage && overlayImage ? (
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg mt-4 flex"
          onClick={payFee}
        >
          {loading ? (
            <>
              {" "}
              <Spinner /> <span className="ml-2">Paying...</span>
            </>
          ) : (
            <>Pay 1 USDC to download</>
          )}
        </button>
      ) : balance < 1 && pfpImage && overlayImage ? (
        <>
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-lg mt-4"
            onClick={fund}
          >
            Insufficient USDC balance, click to fund
          </button>
        </>
      ) : (
        <>
          <button className="bg-red-200 text-white py-2 px-6 rounded-lg mt-4">
            Download Image
          </button>
        </>
      )}
      {isModalOpen && <Balance close={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ImageEditor;
