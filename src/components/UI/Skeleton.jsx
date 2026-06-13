import React from "react";

const Skeleton = ({ width, height, borderRadius }) => {
  return (
    <div
      className="skeleton-box"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#dddddd",
        display: "block",
      }}
    ></div>
  );
};

export default Skeleton;
