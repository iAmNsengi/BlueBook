import { useChatStore } from "../../store/useChatStore";
import NoChatSelected from "../../components/NoChatSelected";
import ChatContainer from "../../components/ChatContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Chat = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-[calc(100vh-8rem]">
          <div className="flex h-[90vh] rounded-lg overflow-hidden">
            <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
              <Sidebar />
            </aside>
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
