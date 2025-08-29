import { X } from 'lucide-react';
import React, {
  type SetStateAction,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useCancelTask } from '~/hooks/useTasks';
import Button from '../ui/button';
import Modal from '../ui/Modal';

interface CancelTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

function CancelTaskModal({
  isOpen,
  onClose,
  taskId,
  setIsOpen,
}: CancelTaskModalProps) {
  const cancelMutation = useCancelTask();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the close function so it's the same reference for add/removeEventListener
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleCancel = () => {
    cancelMutation.mutate({ taskId });
  };

  if (!mounted || !isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
    >
      {/* Header */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded bg-gray-100 p-2 text-gray-400 hover:text-gray-600"
        disabled={cancelMutation.isPending}
      >
        <X className="h-5 w-5" />
      </button>
      <div className="relative w-full space-y-8">
        <div className="flex flex-col items-center justify-center gap-6 pt-6">
          <div className="size-24 rounded-full bg-[#FAFAFA] md:size-40"></div>
          <div className="space-y-2 text-center">
            <p className="text-xl font-bold capitalize text-[#000000] sm:text-[1.5rem]">
              Cancel Task
            </p>
            <p className="text-sm font-medium text-[#414141]">
              Start now, finish in minutes, earn instantly.
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleCancel}
          disabled={cancelMutation.isPending}
        >
          {cancelMutation.isPending ? 'Cancelling task...' : 'Cancel task'}
        </Button>
      </div>
    </Modal>
  );
}

export default CancelTaskModal;
