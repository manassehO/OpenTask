'use client';

import { useParams } from 'next/navigation';
import LearningDetail from './LearningDetails';
import { mockCourses, mockTutorials } from '../mockDatat';

export default function LearningDetailPage() {
  const { id } = useParams();

  const coursesWithType = mockCourses.map((item) => ({
    ...item,
    type: 'course' as const,
  }));
  const tutorialsWithType = mockTutorials.map((item) => ({
    ...item,
    type: 'tutorial' as const,
  }));
  const allItems = [...coursesWithType, ...tutorialsWithType];
  const course = allItems.find((item) => String(item.id) === String(id));

  return <LearningDetail course={course} />;
}
