/* eslint-disable react/prop-types */
import { Image, Loader2, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import { usePostStore } from "../../store/usePostStore";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const NewPostForm = ({ onClose }) => {
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const { isCreatingNewPost, createPost } = usePostStore();

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
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

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorContent.trim() && !image) {
      toast.error("Please add some content or an image");
      return;
    }

    try {
      // If image is too large, compress it before sending
      let processedImage = imagePreview;
      if (image && image.size > MAX_FILE_SIZE) {
        processedImage = await compressImage(imagePreview);
      }

      await createPost({
        content: editorContent.trim(),
        image: processedImage,
      });

      toast.success("Post created successfully!");
      setEditorContent("");
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      toast.error(error.message || "Error creating post. Please try again.");
    }
  };

  // Image compression function
  const compressImage = (base64Image) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress with 0.7 quality
      };
    });
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
          disabled={
            (!editorContent.trim() && !imagePreview) || isCreatingNewPost
          }
        >
          {isCreatingNewPost ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send className="mx-auto" />
          )}
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
