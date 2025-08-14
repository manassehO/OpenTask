'use client';

import { useState } from 'react';
import { useClaimTask } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import { ToastContainer } from '~/_components/ui/Toast';

export default function ClaimTaskTest() {
  const [taskId, setTaskId] = useState('');
  const claimTaskMutation = useClaimTask();
  const { toasts, removeToast } = useToast();

  const handleClaimTask = () => {
    if (!taskId.trim()) {
      // You can also add client-side validation toasts
      return;
    }

    claimTaskMutation.mutate({ taskId: taskId.trim() });
  };

  return (
    <>
      <div className="space-y-4 rounded border p-4">
        <h3 className="font-bold">Test Claim Task with Toasts</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Task ID (must be valid UUID):
          </label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="123e4567-e89b-12d3-a456-426614174000"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          onClick={handleClaimTask}
          disabled={claimTaskMutation.isPending}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {claimTaskMutation.isPending ? 'Claiming...' : 'Claim Task'}
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
