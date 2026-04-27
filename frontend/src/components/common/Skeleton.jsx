import React from "react";
import "./skeleton.css";

const Skeleton = ({ type = "text", width, height, style }) => {
    const customStyle = {
        width,
        height,
        ...style,
    };

    return <div className={`skeleton skeleton-${type}`} style={customStyle} />;
};

export default Skeleton;
