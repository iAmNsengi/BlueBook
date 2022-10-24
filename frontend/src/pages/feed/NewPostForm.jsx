import { Image, Loader2, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import { usePostStore } from "../../store/usePostStore";

const NewPostForm = () => {
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const editorRef = useRef(null);

  const { isCreatingNewPost, createPost } = usePostStore();

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileInputRef = useRef(null);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editorContent.trim() && !image)
      return toast.error("Please add some content or an image");
    createPost({ content: editorContent.trim(), image: imagePreview });
    setEditorContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-6 rounded-lg shadow-md">
      <Editor
        apiKey="iimwa8mt2kajduemd6v24b2kurxwpkyop5m0tjigba1xg4eh"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={editorContent}
        onEditorChange={handleEditorChange}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic underline | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
          type="submit"
          className={`items-center bg-base-300 p-3 rounded-full flex hover:bg-green-700 ${
            !editorContent.trim() && !imagePreview
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer bg-green-600"
          }`}
          disabled={!editorContent.trim() && !imagePreview}
        >
          {isCreatingNewPost ? <Loader2 /> : <Send className="mx-auto" />}
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
