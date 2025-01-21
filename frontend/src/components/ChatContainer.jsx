import { Fragment, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unSubscribeFromMessages,
    getUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => unSubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    getUsers();
  }, [messages, getUsers]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className={`flex-1 overflow-y-auto p-4 space-y-1`}>
        {messages.map((message, i, arr) => (
          <Fragment key={message?._id}>
            {new Date(message?.createdAt).toLocaleDateString() !==
            new Date(arr[i - 1]?.createdAt).toLocaleDateString() ? (
              <div className="divider divider-neutral text-xs px-16">
                {new Date(message?.createdAt).toDateString()}{" "}
              </div>
            ) : (
              ""
            )}
            <div
              key={message?._id}
              className={`chat ${
                message?.senderId === authUser?._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message?.senderId === authUser?._id
                        ? authUser.profilePic || "avatar.png"
                        : selectedUser.profilePic || "avatar.png"
                    }
                    alt={"profile pic"}
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                {formatMessageTime(message.createdAt) ===
                  formatMessageTime(arr[i - 1]?.createdAt) &&
                message.senderId === arr[i - 1]?.senderId ? (
                  <></>
                ) : (
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                )}
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-mb mb-2"
                    loading="lazy"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
