"use client"

import { useRouter } from "next/navigation"
import type { Task } from "../../../../types/task"
import { ArrowLeft, X } from "lucide-react"
import Image from "next/image"

import { useState } from "react"
import Button from "~/_components/ui/button"
import Modal from "~/_components/ui/Modal"


interface TaskDetailProps {
  task: Task | undefined
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const router = useRouter()
  const [isTaskTaken, setIsTaskTaken] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitId, setSubmitId] = useState("")
  const [submitLink, setSubmitLink] = useState("")

  const handleCancelTask = () => {
    setShowCancelModal(true)
  }

  const confirmCancelTask = () => {
    setIsTaskTaken(false)
    setShowCancelModal(false)
    console.log("Task cancelled:", task?.id)
  }

  if (!task) {
    return (
      <div className="mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-[#414141] mb-6">The task you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto py-8">
      {/* Task Content */}
      <div className="rounded-lg">
        <h1 className="text-4xl capitalize font-bold p-6 pb-0">{task.title}</h1>

        <div className="relative w-full h-[300px] md:h-[500px] mt-6">
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

        <div className="p-6 max-w-6xl grid grid-cols-1 gap-y-8">
          <div className="bg-white p-6 rounded-md">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-[#414141] mb-6">{task.description}</p>
              <div className=" rounded-lg p-4 flex items-center gap-4 ">
                <Image src="/icons/spot.svg" alt="Task icon" width={60} height={60} className="w-[60px] h-[60px] object-cover" />
                <div>
                  <span className="text-sm font-semibold">Task Spots Left</span>
                  <p className="font-bold">99 spots left of 100</p>
                </div>
              </div>
          </div>

        <div className="bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <p className="text-[#414141] mb-4">
            Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin
            sed etiam. Ipsum turpis neque eros quisque aliquot vulputate sed venenatis lectus, malesuada in aliquam
            interdum pellentesque.
          </p>

          <ul className="space-y-4 mb-6 pl-6 list-disc marker:text-[#414141]">
            {[
              "Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin sed etiam.",
              "Ipsum turpis neque eros quisque aliquot vulputate sed venenatis lectus.",
              "Malesuada in aliquam interdum pellentesque.",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              "Consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            ].map((step, index) => (
              <li key={index} className="font-semibold pl-2">
                {step}
              </li>
            ))}
          </ul>

          <p className="text-[#414141] mb-8">
            Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin
            sed etiam. Ipsum turpis neque eros quisque aliquot vulputate sed venenatis lectus, malesuada in aliquam
            interdum pellentesque.
          </p>
        </div>

        <div className="bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-3">Reward & Deadline</h2>
          <p className="leading-[32px] text-[#414141] mb-4">
            Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc, dictum non fermentum proin
            sed etiam. Ipsum turpis neque eros quisque aliquot vulputate sed venenatis lectus, malesuada in aliquam
            interdum pellentesque.
          </p>

          <div className="flex flex-wrap gap-8 mb-8">
            <div className="flex items-center gap-2">
                <Image src="/icons/calendar.svg" alt="Task icon" width={60} height={60} className="w-[60px] h-[60px]" />
              <div>
                <div className="text-sm font-semibold">DEADLINE</div>
                <div className="font-bold text-xl">{task.deadline}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
                <Image src="/icons/diamond.svg" alt="Task icon" width={60} height={60} className="w-[60px] h-[60px]" />
              <div>
                <div className="text-sm font-semibold">PRICE</div>
                <div className="font-bold text-xl">
                  {task?.rewardInEth}ETH  <span className="text-blue-500 text-base">&asymp;${task.rewardInUsd.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="flex w-full justify-end gap-4">
            {!isTaskTaken ? (
              <Button
                className="xl:w-[450px] h-[60px]"
                onClick={() => {
                  setIsTaskTaken(true)
                  console.log("Take Task clicked:", task.id)
                }}
              >
                Take Task
              </Button>
            ) : (
              <div className="flex w-full justify-between xl:gap-10">
                <Button
                  textColor="text-red-600"
                  backgroundColor="bg-white"
                  className="xl:w-[450px] h-[60px] transition-all duration-300"
                  onClick={handleCancelTask}
                >
                  Cancel Task
                </Button>
                <Button
                  className="xl:w-[450px] h-[60px]"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Task
                </Button>
              </div>
            )}
          </div>

          {/* Cancel Confirmation Modal */}
          <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
            <div className="mb-4 bg-gray-100 rounded-full p-4">
              <X  className="w-24 h-24"/>
            </div>
            <div className="mb-4">
              <h3 className="text-xl text-center font-bold">Cancel Task</h3>
            </div>
            <p className="mb-6 px-6">
              Are you sure you want to cancel this task? This action cannot be undone.
            </p>
            <div className="flex justify-center w-full gap-4">
              <Button
                textColor="text-white"
                backgroundColor="bg-[#3B82F6]"
                className="px-6 w-full"
                onClick={confirmCancelTask}
              >
                Cancel Task
              </Button>
            </div>
          </Modal>

          {/* Submit Task Modal */}
          <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)}>
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-2xl font-bold text-black">Submit Task</span>
              <button
                type="button"
                className="p-2 h-auto w-auto bg-gray-100 rounded-full text-[#3B82F6] hover:text-blue-700"
                onClick={() => setShowSubmitModal(false)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="w-full flex flex-col gap-4" onSubmit={e => { e.preventDefault(); /* handle submit here */ }}>
              <div className="mb-2">
                <label className="text-left w-full font-medium text-gray-700 mb-1 block" htmlFor="submit-id">Enter ID</label>
                <input
                  id="submit-id"
                  type="text"
                  placeholder="Enter Task ID"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={submitId}
                  onChange={e => setSubmitId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="text-left w-full font-medium text-gray-700 mb-1 block" htmlFor="submit-link">Enter Link</label>
                <input
                  id="submit-link"
                  type="url"
                  placeholder="Enter Link"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={submitLink}
                  onChange={e => setSubmitLink(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                backgroundColor="bg-[#3B82F6]"
                textColor="text-white"
                className="w-full mt-2"
              >
                Proceed
              </Button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  )
}