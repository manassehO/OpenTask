// src/components/ContentCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
} from '~/_components/ui/card';

import Button from '~/_components/ui/button';
interface ContentCardProps {
  item: {
    id: string | number;
    title: string;
    description: string;
    image?: string;
    deadline?: string; // For tasks
    rewardInUsd?: number; // For tasks
    rewardInEth?: string; // For tasks
    modules?: string; // For courses
    progress?: number;
    duration?: string;
    started?: boolean; // For courses, to indicate if the course has been started
    type?: string;
    video?: string; // For courses with video
  };
  buttonLabel?: string;
  onAction: (id: string | number) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onAction: _onAction,
  buttonLabel = 'View',
}) => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Card className="flex h-full w-full flex-col bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* {item.image && (
        <div className="group relative hidden cursor-pointer overflow-hidden rounded-t-lg">
          <CardImage
            src={item.image || '/placeholder.png'}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 transition duration-200 group-hover:bg-black/40">
            <Image
              width={32}
              height={32}
              src="/icons/play.svg"
              alt="Play"
              className="h-12 w-12"
            />
          </div>
        </div>
      )} */}

      {!isPlaying ? (
        // Thumbnail with play button
        <div
          onClick={() => setIsPlaying(true)}
          className="group h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg hover:bg-black/40"
        >
          {/* Background Image */}
          <CardImage
            src={item.image ?? '/placeholder.png'}
            alt={item.title}
            quality={100}
            className="h-full w-full object-cover"
          />
        </div>
      ) : item.video ? (
        <video className="h-[200px] w-full rounded-lg" controls autoPlay>
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-200 md:h-[500px]">
          <span className="text-gray-500">No video available</span>
        </div>
      )}

      <div className="flex flex-1 flex-col px-2">
        <CardHeader className="flex flex-col items-start justify-between space-y-2 pb-2">
          <h3 className="tracking-1 font-semibold capitalize md:text-xl">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm font-medium text-[#414141]">
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1 space-y-2 py-4">
          {typeof item.progress === 'number' && (
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>{item.progress ?? 0}%</span>
              </div>

              {/* Progress bar background */}
              <div className="h-2.5 w-full rounded-full bg-main-50">
                {/* Progress fill bar */}
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    (item.progress ?? 0) === 0 ? 'bg-gray-300' : 'bg-primary'
                  }`}
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardContent className="flex-1">
          <div className="flex h-full flex-row items-center justify-between">
            {item.deadline && (
              <div>
                <div className="text-base text-[#414141]">Deadline</div>
                <div className="font-semibold">{item.deadline}</div>
              </div>
            )}

            {item.modules && (
              <div>
                <div className="font-semibold">{item.modules}</div>
                <div className="font-semibold">{item.duration}</div>
              </div>
            )}

            {item.duration && (
              <div>
                <div className="font-semibold">{item.duration}</div>
              </div>
            )}

            {item.rewardInUsd && (
              <div className="flex items-center text-right">
                <div className="text-sm font-semibold">
                  {item.rewardInEth} ETH
                </div>
                <div className="font-semibold text-[#3B82F6]">
                  ≈ ${item.rewardInUsd.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push(`/learning/${item.id}`)}
            className="flex w-full bg-primary text-[14px]"
          >
            {buttonLabel}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ContentCard;
