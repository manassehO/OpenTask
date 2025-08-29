import { Suspense } from 'react';
import TaskDetail from './TaskDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600">Loading task details...</p>
            </div>
          </div>
        </div>
      }
    >
      <TaskDetail taskId={id} />
    </Suspense>
  );
}
