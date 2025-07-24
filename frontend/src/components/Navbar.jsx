import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  LogOut,
  MessageCircle,
  Settings,
  User,
  Users,
  Search,
  ChevronDown,
  Bell,
  Home,
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const logoutUser = () => {
    setSelectedUser(null);
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-40 ">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2  transition-all overflow-hidden h-14"
            >
              <img
                src="/BlueBook.png"
                alt="BlueBook"
                className="h-full relative"
              />
            </Link>
          </div>

          {authUser && (
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search BlueBook..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                  style={{ focusRingColor: "#4633BD" }}
                />
              </div>
            </div>
          )}

          {/* Right Section - Navigation Icons & User Menu */}
          <div className="flex items-center gap-2 ">
            {authUser && (
              <>
                {/* Home Icon */}
                <Link
                  to="/"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Home"
                >
                  <Home className="w-6 h-6 text-gray-600" />
                </Link>

                {/* Messages Icon */}
                <Link
                  to="/chat"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  title="Messages"
                >
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                  {/* Notification badge (optional) */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Link>

                {/* Notifications Icon */}
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </button>

                {/* Find Friends Icon */}
                <Link
                  to="/find-friends"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Find Friends"
                >
                  <Users className="w-6 h-6 text-gray-600" />
                </Link>
              </>
            )}

            {/* User Dropdown */}
            {authUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {/* User Info */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <img
                        src={authUser.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {authUser.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          View your profile
                        </p>
                      </div>
                    </Link>

                    <hr className="my-2" />

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings & Privacy</span>
                    </Link>

                    <Link
                      to="/chat"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>

                    <hr className="my-2" />

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Button for Non-authenticated Users */}
            {!authUser && (
              <Link
                to="/settings"
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: "#4633BD" }}
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {authUser && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search BlueBook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                style={{ focusRingColor: "#4633BD" }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
