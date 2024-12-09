import { useState, useEffect, useRef } from "react";
import Balance from "./Balance";
import { ArrDown } from "../js/icons";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";

const ImageEditor = () => {
  const [catImage, setCatImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [overlayScale, setOverlayScale] = useState(0.2); // Scale factor for the overlay image
  const canvasRef = useRef(null);
  const canvasWidth = 800;
  const canvasHeight = 600;
  const { wallets } = useWallets();

  // Set initial position of overlay image (mug or beanie)
  const initialPosition = { x: canvasWidth / 2 - 50, y: canvasHeight / 3 };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const switchChain = async () => {
    const wallet = wallets[0];
    await wallet.switchChain(84532);
    const provider = await wallet.getEthersProvider();
    const signer = provider.getSigner();
    return { provider, signer };
  };

  useEffect(() => {
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
  }, []);

  // Handle image upload (cat photo)
  const handleCatImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setCatImage(img);
        drawOnCanvas(img); // Draw the cat image on canvas
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
      imagePath = "/images/beanie.jpeg"; // Replace with actual beanie image path
    }

    img.src = imagePath;
    img.onload = () => {
      setOverlayImage(img); // Set overlay image to the selected one
      setOverlayPosition(initialPosition); // Set initial position for the overlay

      // Redraw canvas immediately after the overlay image is set
      drawOnCanvas(catImage); // Redraw the cat image with overlay
    };
  };

  // Draw images on canvas
  const drawOnCanvas = (catImg) => {
    if (!catImg) return; // If no cat image, do nothing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvasWidth; // Fixed canvas width
    canvas.height = canvasHeight; // Fixed canvas height

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Scale the cat image to fit within the fixed canvas size
    const scale = Math.min(
      canvasWidth / catImg.width,
      canvasHeight / catImg.height
    );
    const x = (canvasWidth - catImg.width * scale) / 2; // Center horizontally
    const y = (canvasHeight - catImg.height * scale) / 2; // Center vertically
    ctx.drawImage(catImg, x, y, catImg.width * scale, catImg.height * scale); // Draw the scaled cat image

    if (overlayImage) {
      ctx.drawImage(
        overlayImage,
        overlayPosition.x,
        overlayPosition.y,
        overlayImage.width * overlayScale, // Scale the overlay image
        overlayImage.height * overlayScale // Scale the overlay image
      );
    }
  };

  // Download the edited image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "edited-image.png";
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

      {isModalOpen && <Balance close={() => setIsModalOpen(false)} />}

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleCatImageChange}
        className="mb-4"
      />

      {/* Overlay buttons to add mug or beanie */}
      {catImage && (
        <div className="mb-4 flex flex-row gap-4">
          {/* <button
            className="cursor-pointer w-32 h-32 border-4 border-gray-500 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => handleOverlayChange('mug')}
          >
            <img
              src="images/image.png" // Placeholder for mug image
              alt="Add Mug"
              className="cursor-pointer w-16 h-16 border-4 border-gray-500 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            />
          </button> */}
          <button onClick={() => handleOverlayChange("beanie")}>
            <img
              src="/images/beanie.jpeg" // Placeholder for beanie image
              alt="Add Beanie"
              className="cursor-pointer w-16 h-16 border-4 border-gray-500 rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
      <button
        className="bg-red-500 text-white py-2 px-6 rounded-lg mt-4"
        onClick={downloadImage}
      >
        Download Image
      </button>
    </div>
  );
};

export default ImageEditor;
