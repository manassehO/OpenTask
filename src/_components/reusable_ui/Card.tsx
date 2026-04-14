'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar } from 'lucide-react';

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

// Helper function to convert duration text to a numerical value for visualization
const parseDurationToValue = (duration: string): number => {
  if (!duration) return 0;

  const lowerDuration = duration.toLowerCase();

  if (lowerDuration.includes('min') || lowerDuration.includes('minute')) {
    const match = /\d+/.exec(duration);
    return match ? parseInt(match[0]) / 60 : 0.1; // Convert minutes to fraction of hour
  }

  if (lowerDuration.includes('hour')) {
    const match = /\d+/.exec(duration);
    return match ? parseInt(match[0]) : 1;
  }

  if (lowerDuration.includes('half day')) return 4; // Approximate half day as 4 hours
  if (lowerDuration.includes('day')) return 8; // Approximate day as 8 hours

  return 1; // Default to 1 hour
};

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onAction: _onAction,
  
}) => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Calculate a visual indicator value based on duration
  const durationValue = item.duration ? parseDurationToValue(item.duration) : 0;
  const maxDurationValue = 8; // Maximum value for normalization (8 hours)
  const durationPercentage = Math.min(
    (durationValue / maxDurationValue) * 100,
    100,
  );

  return (
    <Card className="flex h-full w-full flex-col bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
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

        {/* Progress Bar - Show only if progress exists */}
        {typeof item.progress === 'number' && item.progress > 0 ? (
          <div className="mb-4 mt-2 w-full">
            <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>

            {/* Progress bar container with white background */}
            <div className="h-2 w-full rounded-full border border-gray-200 bg-white">
              {/* Progress fill with blue indicator */}
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ) : (
          // Show duration as a visual indicator when no progress
          <div className="mb-4 mt-2 w-full">
            <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Duration
              </span>
              <span>{item.duration ?? 'Not specified'}</span>
            </div>

            {/* Duration visualization bar */}
            <div className="h-2 w-full rounded-full border border-gray-200 bg-gray-100">
              <div
                className="h-full rounded-full bg-purple-200 transition-all duration-300"
                style={{ width: `${durationPercentage}%` }}
              />
            </div>

            {/* Duration scale markers */}
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Short</span>
              <span>Medium</span>
              <span>Long</span>
            </div>
          </div>
        )}

        <CardContent className="flex-1">
          <div className="flex h-full flex-row items-center justify-between">
            {item.deadline && (
              <div className="flex items-center gap-1">
                <Calendar size={16} className="text-gray-500" />
                <div>
                  <div className="text-sm text-[#414141]">Deadline</div>
                  <div className="text-sm font-semibold">{item.deadline}</div>
                </div>
              </div>
            )}

            {item.modules && (
              <div>
                <div className="font-semibold">{item.modules}</div>
              </div>
            )}

            {item.rewardInUsd && (
              <div className="flex flex-col items-end">
                <div className="text-sm font-semibold">
                  {item.rewardInEth} ETH
                </div>
                <div className="text-sm font-semibold text-[#3B82F6]">
                  ≈ ${item.rewardInUsd.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push(`/completer/learning/${item.id}`)}
            className="flex w-full items-center justify-center gap-2 bg-primary text-[14px]"
          >
            {typeof item.progress === 'number' && item.progress > 0 ? (
              <>Continue learning</>
            ) : (
              <>Start Course</>
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ContentCard;
