import { Search } from "lucide-react";

const FindUsers = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-[calc(100vh-8rem]">
          <div className="h-[80vh] rounded-lg overflow-hidden">
            <form className="w-full flex items-center p-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Search for users..."
              />
              <button className="btn btn-square">
                <Search />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindUsers;
