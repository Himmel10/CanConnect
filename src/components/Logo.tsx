import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/dashboard" className="flex items-center gap-4">
      <img 
        src="/canconnect-logo.png" 
        alt="CanConnect Logo" 
        className="h-24 w-24 object-contain"
      />
      <span className="text-4xl font-bold text-primary">CanConnect</span>
    </Link>
  );
};
