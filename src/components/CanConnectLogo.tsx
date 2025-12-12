import React from "react";

interface CanConnectLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const CanConnectLogo: React.FC<CanConnectLogoProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const dimension = sizeMap[size];

  // Using image asset
  return (
    <img
      src="/canconnect-logo.png"
      alt="CanConnect Logo"
      width={dimension}
      height={dimension}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
};

export default CanConnectLogo;
