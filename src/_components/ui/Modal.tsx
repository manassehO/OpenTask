import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-8 py-12"
      onClick={onClose}
    >
      <div
        className={`mx-4 flex w-full max-w-md flex-col items-center rounded-lg bg-white p-6 text-center ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
