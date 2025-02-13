import { Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import { shuffleElements } from "../lib/utils";
import SmallLoader from "../components/Loader/SmallLoader";

const FindUsers = () => {
  const { onlineUsers, allUsers, getAllUsers, isFindingAllUsers } =
    useAuthStore();
  const { setSelectedUser, searchUsers, users } = useChatStore();
  const [searchQuery, setSearchQuery] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const moveToChat = (user) => {
    setSelectedUser(user);
    navigate("/chat");
  };
  const filterUsers = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) searchUsers(searchQuery);
  };

  const filteredUsers = users.length
    ? users
    : shuffleElements(allUsers).slice(0, 20);

  return (
    <div className="min-h-screen h-full bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-[calc(100vh-8rem]">
          <div className="h-[80vh] rounded-lg overflow-hidden">
            <form
              className="w-full flex items-center p-2 gap-1"
              onSubmit={filterUsers}
            >
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Search for users..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-square">
                <Search />
              </button>
            </form>
            <div className="flex items-center flex-col px-10 pt-10 overflow-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user?._id}
                    onClick={() => moveToChat(user)}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer 
                  }`}
                  >
                    <div className="relative flex flex-col mx-auto lg:mx-0  ">
                      <img
                        src={user?.profilePic || "avatar.png"}
                        alt={user?.fullName}
                        className="size-12 object-cover rounded-full"
                      />
                      {onlineUsers.includes(user?._id) && (
                        <span className="absolute top-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                      )}
                      <div className="text-xs lg:hidden">{user?.fullName}</div>
                    </div>

                    <div className="hidden lg:block text-left min-w-0">
                      <div className="font-medium truncate">
                        {user?.fullName}{" "}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {onlineUsers.includes(user?._id) ? (
                          <span className="text-green-600">Online</span>
                        ) : (
                          <span className="text-red-600">Offline</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <>
                  {isFindingAllUsers ? <SmallLoader /> : <p>No users found</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindUsers;
