'use client';

import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative w-full max-w-sm rounded-md bg-white p-6 shadow-xl transition-all">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <IoCloseOutline size={16} className="text-primary" />
              </button>

              {title && (
                <DialogTitle className="mb-4 text-lg font-semibold text-black">
                  {title}
                </DialogTitle>
              )}

              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
