'use client';
import React, { useState } from 'react';
import { api } from '~/trpc/react';
import ContentCard from '~/_components/reusable_ui/Card';

const tabs = ['Course', 'Tutorial'];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Progress query with safe fallback
  const { data: progressData, error: progressError } =
    api.learning.getUserLearningProgress.useQuery(
      {},
      { retry: false }, // don't retry endlessly if backend is broken
    );

  const safeProgress = progressError ? { progress: [] } : progressData;

  // Courses query
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = api.learning.getCourses.useQuery({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    limit: 9,
  });

  // Tutorials query
  const {
    data: tutorialsData,
    isLoading: tutorialsLoading,
    error: tutorialsError,
  } = api.learning.getTutorials.useQuery({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    limit: 9,
  });

  // Recommendations query
  const { data: recommendations, error: recommendationsError } =
    api.learning.getRecommendations.useQuery({ limit: 3 });

  const onTabChange = (tab: string): void => setActiveTab(tab);

  // Filter enrolled courses/tutorials
  const userCourses =
    safeProgress?.progress
      ?.filter((item) => item.courseId)
      .map((progressItem) => {
        const course = coursesData?.courses.find(
          (c) => c.courseId === progressItem.courseId,
        );
        return course
          ? {
              ...course,
              progress: progressItem.progress,
              isCompleted: progressItem.isCompleted,
            }
          : null;
      })
      .filter(Boolean) ?? [];

  const userTutorials =
    safeProgress?.progress
      ?.filter((item) => item.tutorialId)
      .map((progressItem) => {
        const tutorial = tutorialsData?.tutorials.find(
          (t) => t.tutorialId === progressItem.tutorialId,
        );
        return tutorial
          ? {
              ...tutorial,
              progress: progressItem.progress,
              isCompleted: progressItem.isCompleted,
            }
          : null;
      })
      .filter(Boolean) ?? [];

  // Navigate to detail
  const handleViewTask = (id: string, type: 'course' | 'tutorial'): void => {
    window.location.href = `/learning/${type}/${id}`;
  };

  // Critical error check (ignore NOT_FOUND + ignore progressError)
  const hasCriticalError =
    (coursesError && coursesError.data?.code !== 'NOT_FOUND') ??
    (tutorialsError && tutorialsError.data?.code !== 'NOT_FOUND') ??
    recommendationsError;

  if (hasCriticalError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">
            {coursesError?.message ??
              tutorialsError?.message ??
              recommendationsError?.message ??
              'Failed to load learning data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Updated title styling */}
      <h1 className="mb-4 font-bold capitalize md:text-[28px] md:text-xl">
        learning center
      </h1>

      {/* Updated tab navigation */}
      <div className="mb-4 flex w-full overflow-x-auto bg-white p-2 md:max-w-[244px]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`w-full rounded-[4px] px-8 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {(coursesLoading || tutorialsLoading) && (
        <div className="flex justify-center py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Your Courses */}
      {activeTab === 'Course' && userCourses.length > 0 && (
        <div className="py-4">
          {/* Updated section title styling */}
          <h2 className="text-xl font-semibold capitalize">your courses</h2>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userCourses.map((course) =>
              course ? (
                <ContentCard
                  key={course.courseId}
                  item={{
                    id: course.courseId,
                    title: course.title,
                    description: course.description,
                    image: course.imageUrl ?? '/images/courseImg.png',
                    modules: `${course.modules || 0} modules`,
                    progress: course.progress,
                    rewardInUsd: course.rewardInUsd,
                    rewardInEth: course.rewardAmount,
                    duration: course.duration,
                  }}
                  buttonLabel={
                    course.progress > 0 ? 'Continue learning' : 'Start Course'
                  }
                  onAction={() => handleViewTask(course.courseId, 'course')}
                />
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Your Tutorials */}
      {activeTab === 'Tutorial' && userTutorials.length > 0 && (
        <div className="py-4">
          {/* Updated section title styling */}
          <h2 className="text-xl font-semibold capitalize">your tutorials</h2>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userTutorials.map((tutorial) =>
              tutorial ? (
                <ContentCard
                  key={tutorial.tutorialId}
                  item={{
                    id: tutorial.tutorialId,
                    title: tutorial.title,
                    description: tutorial.description,
                    image: tutorial.imageUrl ?? '/images/cryptoImg.png',
                    duration: tutorial.duration,
                    progress: tutorial.progress,
                    rewardInUsd: tutorial.rewardInUsd,
                    rewardInEth: tutorial.rewardAmount,
                  }}
                  buttonLabel={
                    tutorial.progress > 0
                      ? 'Continue learning'
                      : 'Start Tutorial'
                  }
                  onAction={() =>
                    handleViewTask(tutorial.tutorialId, 'tutorial')
                  }
                />
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* All Courses/Tutorials */}
      <div className="py-4">
        {/* Updated section title styling */}
        <h2 className="text-xl font-semibold capitalize">
          {activeTab === 'Course' ? 'your courses' : ' '}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTab === 'Course'
            ? coursesData?.courses?.map((course) => (
                <ContentCard
                  key={course.courseId}
                  item={{
                    id: course.courseId,
                    title: course.title,
                    description: course.description,
                    image: course.imageUrl ?? '/images/courseImg.png',
                    modules: `${course.modules || 0} modules`,
                    rewardInUsd: course.rewardInUsd,
                    rewardInEth: course.rewardAmount,
                    duration: course.duration,
                  }}
                  buttonLabel="Start Course"
                  onAction={() => handleViewTask(course.courseId, 'course')}
                />
              ))
            : tutorialsData?.tutorials?.map((tutorial) => (
                <ContentCard
                  key={tutorial.tutorialId}
                  item={{
                    id: tutorial.tutorialId,
                    title: tutorial.title,
                    description: tutorial.description,
                    image: tutorial.imageUrl ?? '/images/cryptoImg.png',
                    duration: tutorial.duration,
                    rewardInUsd: tutorial.rewardInUsd,
                    rewardInEth: tutorial.rewardAmount,
                  }}
                  buttonLabel="Start Tutorial"
                  onAction={() =>
                    handleViewTask(tutorial.tutorialId, 'tutorial')
                  }
                />
              ))}
        </div>
      </div>

      {/* Recommended Courses */}
      {activeTab === 'Course' &&
        recommendations &&
        recommendations.recommendations.length > 0 && (
          <div className="py-10">
            {/* Updated section title styling */}
            <h2 className="text-xl font-semibold capitalize">
              courses for you
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.recommendations.map((item) => (
                <ContentCard
                  key={item.courseId}
                  item={{
                    id: item.courseId,
                    title: item.title,
                    description: item.description || '',
                    image: item.imageUrl ?? '/images/courseImg.png',
                    modules: `0 modules`,
                    rewardInUsd: 0,
                    rewardInEth: '0',
                    duration: '',
                  }}
                  buttonLabel="Start Course"
                  onAction={() => handleViewTask(item.courseId, 'course')}
                />
              ))}
            </div>
          </div>
        )}

      {/* Empty states */}
      {activeTab === 'Course' &&
        (!coursesData?.courses || coursesData.courses.length === 0) && (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No courses available
            </h3>
            <p className="text-gray-500">Check back later for new courses.</p>
          </div>
        )}

      {activeTab === 'Tutorial' &&
        (!tutorialsData?.tutorials || tutorialsData.tutorials.length === 0) && (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No tutorials available
            </h3>
            <p className="text-gray-500">Check back later for new tutorials.</p>
          </div>
        )}
    </div>
  );
}
