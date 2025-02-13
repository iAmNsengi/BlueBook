import "./Loader.css";

const SmallLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex text-lg font-bold text-primary items-center space-x-2">
        <span className="bounce delay-0">V</span>
        <span className="bounce delay-1">U</span>
        <span className="bounce delay-2">G</span>
        <span className="bounce delay-3">A</span>
      </div>
    </div>
  );
};

export default SmallLoader;
