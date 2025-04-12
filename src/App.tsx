import React, { useState, useCallback } from "react";

type FlowerColor =
  | "red"
  | "yellow"
  | "pink"
  | "purple"
  | "white"
  | "orange"
  | "blue"
  | "lavender"
  | "green";
type FlowerShape = "daisy" | "tulip" | "rose" | "sunflower" | "lily" | "orchid";

const FlowerCustomizer = () => {
  const [flowerColor, setFlowerColor] = useState<FlowerColor>("red");
  const [flowerShape, setFlowerShape] = useState<FlowerShape>("daisy");
  const [stemHeight, setStemHeight] = useState<number>(80);
  const [message, setMessage] = useState<string>("");

  const handleColorChange = (color: FlowerColor) => setFlowerColor(color);
  const handleShapeChange = (shape: FlowerShape) => setFlowerShape(shape);
  const handleStemHeightChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStemHeight(parseInt(e.target.value, 10));
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const renderFlower = useCallback(() => {
    let flowerDesign;
    switch (flowerShape) {
      case "daisy":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="15" fill="yellow" />
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x = 50 + 25 * Math.cos(angle);
              const y = 50 + 25 * Math.sin(angle);
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="8"
                  ry="12"
                  fill={flowerColor}
                />
              );
            })}
          </svg>
        );
        break;
      case "tulip":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <path
              d="M50 10 C 65 20, 65 40, 50 50 C 35 40, 35 20, 50 10"
              fill={flowerColor}
            />
          </svg>
        );
        break;
      case "rose":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="10" fill="red" />
            {[...Array(5)].map((_, i) => {
              const angle = (i * 72 * Math.PI) / 180;
              const x = 50 + 20 * Math.cos(angle);
              const y = 50 + 20 * Math.sin(angle);
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="8"
                  ry="15"
                  fill={flowerColor}
                />
              );
            })}
          </svg>
        );
        break;
      case "sunflower":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="brown" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 50 + 30 * Math.cos(angle);
              const y = 50 + 30 * Math.sin(angle);
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="10"
                  ry="18"
                  fill={flowerColor}
                />
              );
            })}
          </svg>
        );
        break;
      case "lily":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <path d="M50 10 L60 40 L50 50 L40 40 Z" fill={flowerColor} />
          </svg>
        );
        break;
      case "orchid":
        flowerDesign = (
          <svg id="flower-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="15" fill={flowerColor} />
            {[...Array(5)].map((_, i) => {
              const angle = (i * 72 * Math.PI) / 180;
              const x = 50 + 20 * Math.cos(angle);
              const y = 50 + 20 * Math.sin(angle);
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="8"
                  ry="12"
                  fill={flowerColor}
                />
              );
            })}
          </svg>
        );
        break;
      default:
        flowerDesign = null;
    }
    return flowerDesign;
  }, [flowerColor, flowerShape]);

  const svgToPng = (svg: string) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        } else {
          reject("Canvas rendering context not available.");
        }
      };
      img.onerror = reject;
      img.src = svgUrl;
    });
  };

  const handleShare = async () => {
    try {
      const svgElement = document.getElementById("flower-svg")?.outerHTML;
      if (svgElement) {
        const pngDataUrl = await svgToPng(svgElement);
        const pngBlob = await fetch(pngDataUrl).then((r) => r.blob());
        const file = new File([pngBlob], "flower.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Check out my flower!",
            files: [file],
            text: message || "Here's a beautiful flower for you!",
          });
        } else {
          // Fallback: download the file
          const a = document.createElement("a");
          a.href = pngDataUrl;
          a.download = "flower.png";
          a.click();
          alert("Sharing not supported. The flower was downloaded instead!");
        }
      }
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 p-6">
      <h1 className="text-4xl font-bold text-gray-700 mb-6">
        Flower Customizer
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-6 w-full max-w-md">
        {message && (
          <div className="text-lg font-semibold text-green-600">{message}</div>
        )}

        {/* Flower, Stem, Leaves */}
        <div className="relative flex flex-col items-center">
          {/* Flower */}
          {renderFlower()}

          {/* Stem */}
          <div
            className="bg-green-700 w-2"
            style={{ height: `${stemHeight}px` }}
          />

          {/* Leaves - Always attached to the bottom of the flower */}
          <div
            className="absolute flex w-full justify-between"
            style={{ top: `125px` }} // anchor at bottom of flower
          >
            <div
              className="bg-green-800 w-10 h-3 transform -rotate-45"
              style={{ marginLeft: "-1px" }}
            />
            <div
              className="bg-green-800 w-10 h-3 transform rotate-45"
              style={{ marginRight: "-1px" }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex flex-col w-1/2">
            <select
              className="mt-1 border-gray-300 rounded-md"
              value={flowerColor}
              onChange={(e) => handleColorChange(e.target.value as FlowerColor)}
            >
              {[
                "red",
                "yellow",
                "pink",
                "purple",
                "white",
                "orange",
                "blue",
                "lavender",
                "green",
              ].map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <select
              className="mt-1 border-gray-300 rounded-md"
              value={flowerShape}
              onChange={(e) => handleShapeChange(e.target.value as FlowerShape)}
            >
              {["daisy", "tulip", "rose", "sunflower", "lily", "orchid"].map(
                (shape) => (
                  <option key={shape} value={shape}>
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              Stem Height
            </label>
            <input
              type="range"
              min="20"
              max="150"
              value={stemHeight}
              onChange={handleStemHeightChange}
              className="mt-1 w-full"
            />
          </div>
        </div>

        {/* Message Input */}
        <div className="w-full">
          <input
            type="text"
            className="mt-1 border-gray-300 rounded-md w-full"
            placeholder="Write a message..."
            value={message}
            onChange={handleMessageChange}
          />
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded mt-4"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default FlowerCustomizer;
