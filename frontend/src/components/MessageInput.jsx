import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      // clear the form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send the message: ", error);
      toast.error(error.message);
    }
  };

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

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {" "}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            disabled={isSendingMessage}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            autoFocus
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          className={`items-center bg-base-300 p-3 rounded-full flex hover:bg-green-700 ${
            !text.trim() && !imagePreview
              ? "cursor-not-allowed "
              : "cursor-pointer bg-green-600"
          }`}
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
        >
          {isSendingMessage ? (
            <>
              <Loader2 className="size-5 animate-spin font-bold" />{" "}
            </>
          ) : (
            <Send className="mx-auto" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
