'use client';

import { useParams } from 'next/navigation';
import LearningDetail from './LearningDetails';
import { api } from '~/trpc/react';

export default function LearningDetailPage() {
  const { id } = useParams();
  const itemId = Array.isArray(id) ? id[0] : id;

  // Fetch course by ID
  const { data: courseData, isLoading: courseLoading } =
    api.learning.getCourseById.useQuery(
      { courseId: itemId ?? '' },
      { enabled: !!itemId },
    );

  // Fetch tutorial by ID
  const { data: tutorialData, isLoading: tutorialLoading } =
    api.learning.getTutorialById.useQuery(
      { tutorialId: itemId ?? '' },
      { enabled: !!itemId },
    );

  // Determine which item we found
  const item = courseData
    ? {
        ...courseData,
        type: 'course' as const,
        id: courseData.courseId,
        image: courseData.imageUrl ?? '',
        rewardInEth: parseFloat(courseData.rewardAmount),
        modules: courseData.modules?.toString(),
      }
    : tutorialData
      ? {
          ...tutorialData,
          type: 'tutorial' as const,
          id: tutorialData.tutorialId,
          image: tutorialData.imageUrl ?? '',
          rewardInEth: parseFloat(tutorialData.rewardAmount),
        }
      : undefined;

  if (courseLoading || tutorialLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <LearningDetail course={item} />
    </>
  );
}
