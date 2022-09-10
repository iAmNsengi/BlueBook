import { Users } from "lucide-react";
import PropTypes from "prop-types";

const SidebarTop = ({ showOnlineOnly, setShowOnlineOnly, onlineUsers }) => {
  return (
    <>
      <div className="border-b border-base-300 w-full p-5 flex gap-4">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
      <div className="mt-3 px-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
          />
          <span className="text-sm">Show Online Only</span>
        </label>
        <span className="text-xs text-zinc-500">
          ( {onlineUsers.length - 1} online)
        </span>
      </div>
    </>
  );
};

SidebarTop.propTypes = {
  showOnlineOnly: PropTypes.bool,
  setShowOnlineOnly: PropTypes.func,
  onlineUsers: PropTypes.array,
};
export default SidebarTop;
