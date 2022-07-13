import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    e.preventDefault();
  };
  const removeImage = () => {};
  const handleMessage = async (e) => {};

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
