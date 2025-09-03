'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Button from '~/_components/ui/button';
import { useState } from 'react';

interface LearningItem {
  id: string | number;
  title: string;
  image: string;
  duration: string;
  rewardInEth: number;
  rewardInUsd?: number;
  modules?: string; // For courses
  type: 'course' | 'tutorial';
  video?: string; // Optional video property
  description?: string;
}

export default function LearningDetail({ course }: { course?: LearningItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // when course page is empty
  if (!course) {
    return (
      <div className="mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Course Not Found</h1>
          <p className="mb-6 text-[#414141]">
            The task you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.back()}
            className="mx-auto flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Task Content */}
      <div className="rounded-lg">
        <h1 className="pb-0 text-xl font-bold capitalize leading-[100%] md:max-w-[980px] md:text-[40px]">
          {course.title}
        </h1>

        <div className="space-y-4 md:max-w-[1058px]">
          <div className="mt-6 h-[200px] w-full md:h-[500px]">
            {!isPlaying ? (
              // Thumbnail with play button
              <div
                onClick={() => setIsPlaying(true)}
                className="group relative h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg hover:bg-black/40 md:h-[500px]"
              >
                {/* Background Image */}
                <Image
                  src={
                    course.image ||
                    (course.type === 'course'
                      ? '/images/courseImg.png'
                      : '/images/cryptoImg.png')
                  }
                  alt="course banner"
                  fill
                  quality={100}
                  className="object-cover"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/icons/play.svg"
                    alt="Play"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                  />
                </div>
              </div>
            ) : course.video ? (
              <video
                className="h-[200px] w-full rounded-lg md:h-[500px]"
                controls
                autoPlay
              >
                <source src={course.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-200 md:h-[500px]">
                <span className="text-gray-500">No video available</span>
              </div>
            )}
          </div>

          <div className="mx-auto flex w-full flex-col space-y-4 py-4 md:max-w-[886px]">
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-3 text-lg font-bold md:text-2xl">Summary</h2>
              <p className="mb-4 text-sm text-[#414141] md:text-base md:leading-[32px]">
                {course.description ??
                  'Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc. Dictum non fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet vulputate sed venenatis lectus. Morbi in aliquam interdum pellentesque. Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet tincidunt ut nunc. Dictum non fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet vulputate sed venenatis lectus. Morbi in aliquam interdum pellentesque.'}
              </p>
            </div>

            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-3 text-lg font-bold md:text-2xl">
                Reward & Duration
              </h2>

              <div className="mb-8 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/calendar.svg"
                    alt="Task icon"
                    width={60}
                    height={60}
                    className="h-[60px] w-[60px]"
                  />
                  <div>
                    <div className="text-sm font-semibold">Duration</div>
                    <div className="text-base font-bold md:text-xl">
                      {course.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/diamond.svg"
                    alt="course icon"
                    width={60}
                    height={60}
                    className="h-[60px] w-[60px]"
                  />
                  <div>
                    <div className="text-sm font-semibold">REWARD</div>
                    <div className="text-base font-bold md:text-xl">
                      {course.rewardInEth} ETH
                      {course.rewardInUsd && (
                        <span className="text-base text-blue-500">
                          &asymp; ${course.rewardInUsd.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modules – show only for Course */}
            {course.type === 'course' && course.modules && (
              <div className="rounded-lg bg-white p-6">
                <h2 className="mb-3 text-lg font-bold md:text-2xl">Modules</h2>

                <div className="">
                  <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                    <div className="flex w-full items-center justify-between rounded-md bg-main p-4 text-sm font-semibold md:text-base">
                      <h1 className="text medium">
                        Module 1: Introduction to Micro Tasks
                      </h1>

                      <Image
                        src="/icons/success.svg"
                        alt="Task icon"
                        width={20}
                        height={20}
                        className="h-[20px] w-[20px]"
                      />
                    </div>

                    <div className="flex w-full items-center justify-between rounded-md bg-main p-4 text-sm font-semibold md:text-base">
                      <h1 className="text medium">Module 2: Getting Started</h1>

                      <Image
                        src="/icons/play.svg"
                        alt="Task icon"
                        width={20}
                        height={20}
                        className="h-[20px] w-[20px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex w-full justify-end gap-4 py-5">
              <Button
                className="w-full p-3 md:w-[450px]"
                onClick={() => router.back()}
              >
                done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
