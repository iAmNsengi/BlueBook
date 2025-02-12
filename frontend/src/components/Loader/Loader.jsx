import { Loader2 } from "lucide-react";
import "./Loader.css"; // Import the CSS file

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <div className="flex text-6xl font-bold text-primary items-center space-x-2">
        <span className="bounce delay-0">V</span>
        <span className="bounce delay-1">U</span>
        <span className="bounce delay-2">G</span>
        <span className="bounce delay-3">A</span>
      </div>
      <Loader2 className="animate-spin text-secondary size-8" />
    </div>
  );
};

export default Loader;
