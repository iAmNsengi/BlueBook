const RightSidebar = () => {
  const suggestedFriends = [
    { name: "John Doe", mutualFriends: 5 },
    { name: "Jane Smith", mutualFriends: 3 },
    { name: "Mike Johnson", mutualFriends: 8 },
  ];

  return (
    <div className="hidden xl:block w-80 fixed right-0 top-16 h-full bg-white border-l p-4">
      <div className="space-y-6">
        {/* Suggested Friends */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            People you may know
          </h3>
          <div className="space-y-3">
            {suggestedFriends.map((friend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/avatar.png"
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-500">
                      {friend.mutualFriends} mutual friends
                    </p>
                  </div>
                </div>
                <button
                  className="px-3 py-1 text-white text-sm rounded-lg hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#4633BD" }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Online Friends */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Online Friends</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="relative">
                  <img
                    src="/avatar.png"
                    alt="Friend"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="font-medium text-gray-900">Friend {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
