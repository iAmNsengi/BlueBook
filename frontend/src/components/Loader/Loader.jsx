import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <div className="flex text-6xl font-bold text-primary items-center space-x-2">
        <span className="bounce delay-0">V</span>
        <span className="bounce delay-1">U</span>
        <span className="bounce delay-2">G</span>
        <span className="bounce delay-3">A</span>
      </div>
      <div className="flex text-6xl font-bold text-primary items-center space-x-8">
        <span className="dot delay-0">•</span>
        <span className="dot delay-1">•</span>
        <span className="dot delay-2">•</span>
        <span className="dot delay-3">•</span>
      </div>
    </div>
  );
};

export default Loader;
