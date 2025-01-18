import { MessagesSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center py-80 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* icon displayed here */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessagesSquare className="size-8 text-primary" />
            </div>
          </div>
        </div>

        {/* welcome text */}
        <h2 className="text-2xl font-bold">Welcome to Vuga community 🤗</h2>
        <p className="text-base-content/60">
          Select a conversation on the sidebar and start a chatting 👌
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
