'use client';
import React from 'react';
import { createTask } from '~/app/api/task';

type Props = object;

function page({}: Props) {
  const createTaskMutation = createTask();

  const handleClick = async () => {
    // console.log("handClick");
    try {
      const res = await createTaskMutation.mutateAsync({
        status: 'DRAFT',
        title: 'My First Task',
        description: 'Do something amazing',
        instructions: 'Follow these steps...',
        category: 'Development',
        rewardAmount: '100',
        rewardTokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
        deadline: '2025-09-01',
        fundingTxHash:
          '0x2f8f4f25a2d8c58c9c4f0f8af3e4b67890abcdef1234567890abcdef12345678',
        image: '',
        maxCompletions: 20,
        requiredCompletions: 1,
      });

      if (!res) {
        throw new Error('something went wrong');
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* <span>page</span> */}
      <button onClick={handleClick}>click me</button>
    </div>
  );
}

export default page;
