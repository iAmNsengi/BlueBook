/* eslint-disable react/prop-types */
import { memo } from "react";

const Modal = memo(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl relative max-w-3xl w-full mx-4">
        <button
          className="absolute top-4 right-4 btn btn-ghost btn-circle"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";
export default Modal;
