import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  LogOut,
  MessageCircle,
  MessagesSquare,
  Settings,
  User,
  UserSearchIcon,
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();

  const logoutUser = () => {
    setSelectedUser(null);
    logout();
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <h1>Vuga</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/chat"} className="btn btn-sm gap-2">
                  <MessageCircle className="size-5" />
                  Chats
                </Link>
                <Link to={"/find-friends"} className="btn btn-sm gap-2">
                  <UserSearchIcon className="size-5" />
                  Find Users
                </Link>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                </Link>
              </>
            )}
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="size-4 motion-safe:animate-spin" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && (
              <button
                className="flex gap-2 items-center border border-red-800 text-white bg-red-800 px-3 py-2 rounded-lg hover:bg-transparent hover:scale-90 hover:text-red-800"
                onClick={logoutUser}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
