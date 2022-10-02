import { Image, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import toast from "react-hot-toast";

const NewPostForm = () => {
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
  const fileInputRef = useRef(null);

  const handleModelChange = (content) => {
    if (content) {
      setEditorContent(content);
    } else {
      console.error("Received null or undefined content");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editorContent);
    console.log(image);
    // Add your submit logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-6  rounded-lg shadow-md editor"
      id="editor"
    >
      <h2 className="text-2xl font-bold mb-4">Add Post</h2>
      <FroalaEditorComponent
        model={editorContent}
        onModelChange={handleModelChange}
        config={{
          toolbarButtons: [
            "bold",
            "italic",
            "underline",
            "paragraphFormat",
            "align",
            "formatOL",
            "formatUL",
            "insertHR",
            "clearFormatting",
            "insertImage",
          ],
          imageUpload: false,
        }}
      />
      <div className="mt-4 flex items-center justify-end gap-2">
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

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
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
        <button
          className={`items-center bg-base-300 p-3 rounded-full flex hover:bg-green-700 ${
            !editorContent.trim() && !imagePreview
              ? "cursor-not-allowed "
              : "cursor-pointer bg-green-600"
          }`}
          disabled={!editorContent.trim() && !imagePreview}
        >
          <Send className="mx-auto" />
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
