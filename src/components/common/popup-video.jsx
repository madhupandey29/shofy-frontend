'use client';
import React from "react";

const PopupVideo = ({ isVideoOpen, setIsVideoOpen, videoId }) => {
  if (!isVideoOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={() => setIsVideoOpen(false)}
    >
      <video
        src={videoId}
        controls
        autoPlay
        style={{ maxWidth: "90vw", maxHeight: "80vh", background: "#000" }}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

export default PopupVideo;
