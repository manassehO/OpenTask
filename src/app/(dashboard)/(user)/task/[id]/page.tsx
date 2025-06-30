import { Suspense } from "react"
import { mockTasks } from "@/mocks/tasks"
import TaskDetail from "./TaskDetail"

interface PageProps {
  params: {
    id: string
  }
}

export default async function TaskPage({ params }: PageProps) {
  // Simulate API call
  const task = mockTasks.find((t) => t.id === params.id)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskDetail task={task} />
    </Suspense>
  )
}
