import React, { useState, useRef } from 'react';

const ImageEditor = () => {
  const [catImage, setCatImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 100, y: 100 });
  const canvasRef = useRef(null);

  // Handle image upload (cat photo)
  const handleCatImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setCatImage(img);
        drawOnCanvas(img);
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
      setOverlayImage(img);  // Set overlay image to the selected one
      setOverlayPosition({ x: 100, y: 100 }); // You can change this if needed for positioning
      drawOnCanvas(catImage);  // Redraw canvas with new overlay image
    };
  };

  // Draw images on canvas
  const drawOnCanvas = (catImg) => {
    if (!catImg) return;  // If no cat image, do nothing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = catImg.width;
    canvas.height = catImg.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawings
    ctx.drawImage(catImg, 0, 0); // Draw the cat image

    if (overlayImage) {
      ctx.drawImage(overlayImage, overlayPosition.x, overlayPosition.y);  // Draw the overlay image
    }
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
              src="/images/image.png" // Placeholder for mug image
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

      {/* Canvas to display image and overlay */}
      <canvas
        ref={canvasRef}
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
