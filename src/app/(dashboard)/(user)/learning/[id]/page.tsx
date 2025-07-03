'use client';

import { useParams } from 'next/navigation';
import LearningDetail from './LearningDetails';
import { mockCourses, mockTutorials } from '../mockData';

export default function LearningDetailPage() {
  const { id } = useParams();

  const allItems = [...mockCourses, ...mockTutorials];
  const course = allItems.find((item) => String(item.id) === String(id));

  return <LearningDetail course={course} />;
}
