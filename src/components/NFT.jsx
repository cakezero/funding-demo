import React, { useState, useRef, useEffect } from 'react';

const ImageEditor = () => {
  const [catImage, setCatImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlayScale, setOverlayScale] = useState(0.2); // Scale factor for the overlay image
  const [showMoveButton, setShowMoveButton] = useState(false); // State to show Move button after overlay is selected
  const canvasRef = useRef(null);
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Set initial position of overlay image (beanie or mug)
  const initialPosition = { x: canvasWidth / 2 - 50, y: canvasHeight / 3 };

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
    let imagePath = '';

    // Choose image based on the overlay type (mug or beanie)
    if (overlayType === 'mug') {
      imagePath = '/path/to/mug-image.png'; // Replace with actual mug image path
    } else if (overlayType === 'beanie') {
      imagePath = '/images/image.png'; // Replace with actual beanie image path
    }

    img.src = imagePath;
    img.onload = () => {
      setOverlayImage(img); // Set overlay image to the selected one
      setOverlayPosition(initialPosition); // Set initial position for the overlay

      // Redraw canvas immediately after the overlay image is set
      drawOnCanvas(catImage); // Redraw the cat image with overlay

      // Show move button after overlay image is set
      setShowMoveButton(true);
    };
  };

  // Draw images on canvas
  const drawOnCanvas = (catImg) => {
    if (!catImg) return; // If no cat image, do nothing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth; // Fixed canvas width
    canvas.height = canvasHeight; // Fixed canvas height

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Scale the cat image to fit within the fixed canvas size
    const scale = Math.min(canvasWidth / catImg.width, canvasHeight / catImg.height);
    const x = (canvasWidth - catImg.width * scale) / 2; // Center horizontally
    const y = (canvasHeight - catImg.height * scale) / 2; // Center vertically
    ctx.drawImage(catImg, x, y, catImg.width * scale, catImg.height * scale); // Draw the scaled cat image

    if (overlayImage) {
      ctx.drawImage(
        overlayImage,
        overlayPosition.x,
        overlayPosition.y,
        overlayImage.width * overlayScale, // Scale the overlay image
        overlayImage.height * overlayScale  // Scale the overlay image
      );
    }
  };

  // Handle keydown event to move the overlay image for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!overlayImage) return; // If no overlay image, do nothing

      let newPos = { ...overlayPosition };

      switch (e.key) {
        case 'ArrowUp':
          newPos.y -= 10;
          break;
        case 'ArrowDown':
          newPos.y += 10;
          break;
        case 'ArrowLeft':
          newPos.x -= 10;
          break;
        case 'ArrowRight':
          newPos.x += 10;
          break;
        default:
          return; // If key is not an arrow key, do nothing
      }

      setOverlayPosition(newPos); // Update overlay position
      drawOnCanvas(catImage); // Redraw canvas with new position
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayImage, overlayPosition, catImage]);

  // Handle touch events for mobile
  const handleTouchMove = (e) => {
    if (!overlayImage) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    setOverlayPosition({ x: touchX - overlayImage.width * overlayScale / 2, y: touchY - overlayImage.height * overlayScale / 2 });
    drawOnCanvas(catImage); // Redraw canvas with new touch position
  };

  // Download the edited image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'edited-image.png';
    link.click();
  };

  // Handle on-screen arrow buttons for mobile devices
  const moveOverlay = (direction) => {
    let newPos = { ...overlayPosition };
    switch (direction) {
      case 'up':
        newPos.y -= 10;
        break;
      case 'down':
        newPos.y += 10;
        break;
      case 'left':
        newPos.x -= 10;
        break;
      case 'right':
        newPos.x += 10;
        break;
      default:
        return;
    }
    setOverlayPosition(newPos);
    drawOnCanvas(catImage);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h3 className="text-2xl font-semibold mb-4">Upload and Edit Image</h3>

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
          <button
            className="cursor-pointer w-32 h-32"
            onClick={() => handleOverlayChange('mug')}
          >
            <img
              src="/path/to/mug-image.png" // Placeholder for mug image
              alt="Add Mug"
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="cursor-pointer w-32 h-32"
            onClick={() => handleOverlayChange('beanie')}
          >
            <img
              src="/images/image.png" // Placeholder for beanie image
              alt="Add Beanie"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      )}

      {/* Move Button (only for desktop users, not visible on mobile) */}
      {showMoveButton && (
        <div className="mb-4">
          <button
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg mb-4"
            onClick={() => console.log("Use arrow keys to move")}
          >
            Use Arrow Keys to Move
          </button>
        </div>
      )}

      {/* Canvas to display image and overlay */}
      <canvas
        ref={canvasRef}
        onTouchMove={handleTouchMove} // Mobile touch event
        onTouchEnd={e => e.preventDefault()} // Prevent default touch behavior
        style={{ border: '1px solid #000', cursor: 'pointer' }}
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
