import { useAuthStore } from "../../store/useAuthStore";
import { Home, Users, Bell, MessageCircle, Settings } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthStore();

  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Users, label: "Friends" },
    { icon: MessageCircle, label: "Messages" },
    { icon: Bell, label: "Notifications" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="hidden lg:block w-64 fixed left-0 top-16 h-full bg-white border-r p-4">
      <div className="space-y-2">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">
            {authUser?.fullName}
          </span>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              item.active ? "text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
            style={item.active ? { backgroundColor: "#4633BD" } : {}}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
