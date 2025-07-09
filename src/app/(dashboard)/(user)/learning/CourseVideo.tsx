'use client';
import { useState } from 'react';
import Image from 'next/image';

type Course = {
  image: string;
  video: string;
  // add other properties as needed
};

export default function CourseVideo({ course }: { course: Course }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mt-6 w-full">
      {!isPlaying ? (
        // Thumbnail with play button
        <div
          onClick={() => setIsPlaying(true)}
          className="group flex h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg hover:bg-black/40 md:h-[500px]"
        >
          {/* Background Image */}
          <Image
            src={course.image}
            alt="course banner"
            width={1000}
            height={500}
            className="h-full w-full object-cover opacity-70"
          />

          {/* Play Icon */}
          <div className="z-10 flex items-center justify-center">
            <Image
              src="/icons/play.svg"
              alt="Play"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>
        </div>
      ) : (
        // Video Player
        <video
          className="h-[200px] w-full rounded-lg md:h-[500px]"
          controls
          autoPlay
        >
          <source src={course.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
