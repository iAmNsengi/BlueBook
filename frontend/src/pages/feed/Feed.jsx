const Feed = () => {
  return (
      <div className="p-4">
          
      <div className="grid grid-cols-1 gap-4">
        <div className="card bg-base-100 shadow-lg transition-transform transform hover:scale-105">
          <div className="card-header flex items-center p-4 border-b">
            <img
              src="https://via.placeholder.com/40"
              alt="Post User Avatar"
              className="rounded-full mr-2"
            />
            <div>
              <h2 className="font-bold">Post User Name</h2>
              <p className="text-sm text-gray-500">Posted 2 hours ago</p>
            </div>
          </div>
          <img
            src="https://via.placeholder.com/400"
            alt="Post"
            className="w-full rounded-t-lg"
          />
          <div className="card-body p-4">
            <h2 className="card-title">Post Title</h2>
            <p>This is a sample post content that describes the image above.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Like</button>
              <button className="btn btn-secondary">Comment</button>
            </div>
          </div>
        </div>
        {/* Add more posts as needed */}
      </div>
    </div>
  );
};

export default Feed;
