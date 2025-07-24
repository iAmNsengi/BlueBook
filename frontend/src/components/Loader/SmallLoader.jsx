import "./Loader.css";

const SmallLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex text-sm font-bold text-primary items-center space-x-1">
        <span className="bounce delay-0">B</span>
        <span className="bounce delay-1">L</span>
        <span className="bounce delay-2">U</span>
        <span className="bounce delay-3">E</span>
        <span className="bounce delay-1">B</span>
        <span className="bounce delay-0">O</span>
        <span className="bounce delay-2">O</span>
        <span className="bounce delay-3">K</span>
      </div>
    </div>
  );
};

export default SmallLoader;
