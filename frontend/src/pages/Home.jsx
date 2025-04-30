import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Landing from "../components/Landing";
import AboveFooter from "../components/AboveFooter";
import HowItWorks from "../components/HowItWorks";

const Home = () => {
  const { modelUrl,setShowLogin,loggedIn} = useContext(AppContext); // Get API URL from context
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const uploadSectionRef = useRef(null);

  // Handler to click the analyze button
  const onClickHandler = async () => {
    if (!loggedIn) {  
      setShowLogin(true);
      return;
    }

    if (!file) {
      setError("Please select a video file first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    console.log(modelUrl);
    try {
      // Make POST request to FastAPI model
      const response = await fetch(modelUrl, {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to analyze video. Please try again.");
      }

      const data = await response.json();
      setResult(data);
      console.log(data); // Log the result for debugging
    } catch (error) {
      console.error("Error:", error);
      setError("Error analyzing the video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Landing uploadSectionRef={uploadSectionRef} />

      {/* Upload Section */}
      <div ref={uploadSectionRef} className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="p-8 rounded-lg shadow-lg max-w-2xl w-full text-center bg-gray-900">
          <h1 className="text-4xl font-bold mb-4">VidShield Video Detector</h1>
          <p className="text-lg leading-relaxed mb-6">
            Upload a video to check if it's AI-generated or real.
          </p>

          {/* File input section */}
          <div className="w-full p-6 bg-gray-700 border-dashed border-2 border-gray-500 rounded-xl text-center cursor-pointer hover:bg-gray-600 transition">
            <p className="font-medium">Drag & Drop your video here</p>
            <p className="text-sm">or</p>
            <input
              type="file"
              accept="video/*"
              className="mt-2 px-4 py-2 border rounded-lg cursor-pointer bg-gray-800 text-white"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && <p className="text-sm mt-2 font-semibold">Selected: {file.name}</p>}
          </div>

          {/* Analyze Video Button */}
          <button
            className="mt-6 px-6 py-3 bg-gray-800 rounded-lg font-medium text-white shadow-md hover:bg-gray-700 transition"
            onClick={onClickHandler}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Video"}
          </button>

          {/* Display error message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>

      {/* Display result after analysis */}
      {result && (
  <div className="flex flex-col items-center justify-start p-6">
    <div className="p-8 rounded-lg shadow-lg max-w-lg w-full text-center bg-gray-800">
      <h2 className="text-3xl font-bold mb-4">Analysis Result</h2>
      
      <p className="text-xl">
  Prediction:{" "}
  <span
    className={`font-bold ${
      result.prediction === "FAKE" ? "text-red-500" : "text-green-500"
    }`}
  >
    {result.prediction}
  </span>
</p>
      { <p className="text-lg">
        Fake Probability: <span className="font-semibold">{(result.fake_probability * 100).toFixed(2)}%</span>
      </p> }
    </div>
  </div>
)}

      <HowItWorks />
      <AboveFooter />
    </div>
  );
};

export default Home;