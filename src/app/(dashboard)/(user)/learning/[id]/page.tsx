// app/(main)/learning/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import LearningDetail from './LearningDetails';

// Mock course data
const mockCourses = [
  {
    id: '1',
    title: 'React Basics',
    description: 'Learn the basics of React.',
    image: '/images/react.png',
    deadline: '2025-07-10',
    rewardInEth: 0.03,
    rewardInUsd: 100,
    duration: '2h 30m',
  },
  {
    id: '2',
    title: 'Next.js Advanced',
    description: 'Dive deep into fullstack with Next.js.',
    image: '/images/next.png',
    deadline: '2025-08-01',
    rewardInEth: 0.06,
    rewardInUsd: 200,
    duration: '3h 15m',
  },
];

export default function LearningDetailPage() {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);

  return <LearningDetail course={course} />;
}
