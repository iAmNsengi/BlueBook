import React, { useRef, useState } from "react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);
  
  return <div>Message Input</div>;
};

export default MessageInput;
