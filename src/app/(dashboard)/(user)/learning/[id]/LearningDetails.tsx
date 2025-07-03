'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import Button from '~/_components/ui/button';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  deadline: string;
  rewardInEth: number;
  rewardInUsd?: number;
  duration?: string;
}

interface CourseDetailProps {
  course: Course | undefined;
}

export default function LearningDetail({ course }: CourseDetailProps) {
  const router = useRouter();

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
    <div className="mx-auto py-8">
      {/* Task Content */}
      <div className="rounded-lg">
        <h1 className="pb-0 text-4xl font-bold capitalize">{course.title}</h1>

        <div className="relative mt-6 h-[300px] w-full md:h-[500px] md:max-w-[1058px]">
          <div className="absolute inset-0 bg-black">
            <div className="relative h-full w-full">
              <Image
                src={course.image}
                alt="course banner"
                fill
                className="object-cover opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-y-8 p-6 md:max-w-[886px]">
          <div className="rounded-md bg-white p-6">
            <h2 className="mb-3 text-lg font-bold md:text-2xl">Summary</h2>
            <p className="mb-4 text-sm leading-[32px] text-[#414141] md:text-base">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc. Dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquet vulputate sed venenatis lectus.
              Morbi in aliquam interdum pellentesque. Lorem ipsum dolor sit amet
              consectetur. Dolor justo diam amet tincidunt ut nunc. Dictum non
              fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet
              vulputate sed venenatis lectus. Morbi in aliquam interdum
              pellentesque.
            </p>
          </div>

          <div className="rounded-md bg-white p-6">
            <h2 className="mb-3 text-lg font-bold md:text-2xl">
              Reward & Deadline
            </h2>
            <p className="text- mb-4 text-sm leading-[32px] md:text-base">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc. Dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquet vulputate sed venenatis lectus.
              Morbi in aliquam interdum pellentesque. Lorem ipsum dolor sit amet
              consectetur. Dolor justo diam amet tincidunt ut nunc. Dictum non
              fermentum proin sed etiam. Ipsum turpis neque eros quisque aliquet
              vulputate sed venenatis lectus. Morbi in aliquam interdum
              pellentesque.
            </p>

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
                  <div className="text-sm font-semibold">Watch time</div>
                  <div className="text-xl font-bold">{course.duration}</div>
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
                  <div className="text-sm font-semibold">PRICE</div>
                  <div className="text-xl font-bold">
                    {course.rewardInEth}ETH{' '}
                    <span className="text-base text-blue-500">
                      &asymp;${course.rewardInUsd?.toLocaleString() ?? '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end gap-4">
            <Button
              className="h-[60px] xl:w-[450px]"
              onClick={() => router.back()}
            >
              done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
