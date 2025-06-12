import React from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex py-12 px-8 items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white text-center flex flex-col items-center rounded-lg p-6 max-w-md w-full mx-4 ${className || ""}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal 