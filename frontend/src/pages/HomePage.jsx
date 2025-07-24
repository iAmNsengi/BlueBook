import RightSidebar from "./feed/RightSidebar";
import Sidebar from "./feed/Sidebar";
import Feed from "../pages/feed/Feed";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Layout */}
      <div className="flex pt-16">
        <Sidebar />

        {/* Main Feed */}
        <div className="flex-1 lg:ml-64 xl:mr-80">
          <div className="py-6 px-4">
            <Feed />
          </div>
        </div>

        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
