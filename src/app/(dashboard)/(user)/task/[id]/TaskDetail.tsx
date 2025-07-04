'use client';

import { useRouter } from 'next/navigation';
import type { Task } from '@/types/task';
import { ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';

import { useState } from 'react';
import Button from '~/_components/ui/button';
import Modal from '~/_components/ui/Modal';

interface TaskDetailProps {
  task: Task | undefined;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const router = useRouter();
  const [isTaskTaken, setIsTaskTaken] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitId, setSubmitId] = useState('');
  const [submitLink, setSubmitLink] = useState('');

  const handleCancelTask = () => {
    setShowCancelModal(true);
  };

  const confirmCancelTask = () => {
    setIsTaskTaken(false);
    setShowCancelModal(false);
    console.log('Task cancelled:', task?.id);
  };

  if (!task) {
    return (
      <div className="mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Task Not Found</h1>
          <p className="mb-6 text-[#414141]">
            The task you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.back()}
            className="mx-auto flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8">
      {/* Task Content */}
      <div className="rounded-lg">
        <h1 className="p-6 pb-0 text-4xl font-bold capitalize">{task.title}</h1>

        <div className="relative mt-6 h-[300px] w-full md:h-[500px]">
          <div className="absolute inset-0 bg-black">
            <div className="relative h-full w-full">
              <Image
                src={task.image}
                alt="Task banner"
                fill
                className="object-cover opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-y-8 p-6">
          <div className="rounded-md bg-white p-6">
            <h2 className="mb-3 text-xl font-bold">Description</h2>
            <p className="mb-6 text-[#414141]">{task.description}</p>
            <div className="flex items-center gap-4 rounded-lg p-4">
              <Image
                src="/icons/spot.svg"
                alt="Task icon"
                width={60}
                height={60}
                className="h-[60px] w-[60px] object-cover"
              />
              <div>
                <span className="text-sm font-semibold">Task Spots Left</span>
                <p className="font-bold">99 spots left of 100</p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-white p-6">
            <h2 className="mb-3 text-xl font-bold">Instructions</h2>
            <p className="mb-4 text-[#414141]">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquot vulputate sed venenatis lectus,
              malesuada in aliquam interdum pellentesque.
            </p>

            <ul className="mb-6 list-disc space-y-4 pl-6 marker:text-[#414141]">
              {[
                'Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.',
                'Ipsum turpis neque eros quisque aliquot vulputate sed venenatis lectus.',
                'Malesuada in aliquam interdum pellentesque.',
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                'Consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
              ].map((step, index) => (
                <li key={index} className="pl-2 font-semibold">
                  {step}
                </li>
              ))}
            </ul>

            <p className="mb-8 text-[#414141]">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquot vulputate sed venenatis lectus,
              malesuada in aliquam interdum pellentesque.
            </p>
          </div>

          <div className="rounded-md bg-white p-6">
            <h2 className="mb-3 text-xl font-bold">Reward & Deadline</h2>
            <p className="mb-4 leading-[32px] text-[#414141]">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquot vulputate sed venenatis lectus,
              malesuada in aliquam interdum pellentesque.
            </p>

            <div className="mb-8 flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/calendar.svg"
                  alt="Task icon"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px]"
                />
                <div>
                  <div className="text-sm font-semibold">DEADLINE</div>
                  <div className="text-xl font-bold">{task.deadline}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icons/diamond.svg"
                  alt="Task icon"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px]"
                />
                <div>
                  <div className="text-sm font-semibold">PRICE</div>
                  <div className="text-xl font-bold">
                    {task?.rewardInEth}ETH{' '}
                    <span className="text-base text-blue-500">
                      &asymp;${task.rewardInUsd.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end gap-4">
            {!isTaskTaken ? (
              <Button
                className="h-[60px] xl:w-[450px]"
                onClick={() => {
                  setIsTaskTaken(true);
                  console.log('Take Task clicked:', task.id);
                }}
              >
                Take Task
              </Button>
            ) : (
              <div className="flex w-full justify-between xl:gap-10">
                <Button
                  textColor="text-red-600"
                  backgroundColor="bg-white"
                  className="h-[60px] transition-all duration-300 xl:w-[450px]"
                  onClick={handleCancelTask}
                >
                  Cancel Task
                </Button>
                <Button
                  className="h-[60px] xl:w-[450px]"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Task
                </Button>
              </div>
            )}
          </div>

          {/* Cancel Confirmation Modal */}
          <Modal
            open={showCancelModal}
            onClose={() => setShowCancelModal(false)}
          >
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <X className="h-24 w-24" />
            </div>
            <div className="mb-4">
              <h3 className="text-center text-xl font-bold">Cancel Task</h3>
            </div>
            <p className="mb-6 px-6">
              Are you sure you want to cancel this task? This action cannot be
              undone.
            </p>
            <div className="flex w-full justify-center gap-4">
              <Button
                textColor="text-white"
                backgroundColor="bg-[#3B82F6]"
                className="w-full px-6"
                onClick={confirmCancelTask}
              >
                Cancel Task
              </Button>
            </div>
          </Modal>

          {/* Submit Task Modal */}
          <Modal
            open={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
          >
            <div className="mb-4 flex w-full items-center justify-between">
              <span className="text-2xl font-bold text-black">Submit Task</span>
              <button
                type="button"
                className="h-auto w-auto rounded-full bg-gray-100 p-2 text-[#3B82F6] hover:text-blue-700"
                onClick={() => setShowSubmitModal(false)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault(); /* handle submit here */
              }}
            >
              <div className="mb-2">
                <label
                  className="mb-1 block w-full text-left font-medium text-gray-700"
                  htmlFor="submit-id"
                >
                  Enter ID
                </label>
                <input
                  id="submit-id"
                  type="text"
                  placeholder="Enter Task ID"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={submitId}
                  onChange={(e) => setSubmitId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  className="mb-1 block w-full text-left font-medium text-gray-700"
                  htmlFor="submit-link"
                >
                  Enter Link
                </label>
                <input
                  id="submit-link"
                  type="url"
                  placeholder="Enter Link"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={submitLink}
                  onChange={(e) => setSubmitLink(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                backgroundColor="bg-[#3B82F6]"
                textColor="text-white"
                className="mt-2 w-full"
              >
                Proceed
              </Button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
