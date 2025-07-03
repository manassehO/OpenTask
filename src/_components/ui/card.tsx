import * as React from 'react';
import { cn } from '@/lib/utils';
import Image, { type ImageProps } from 'next/image';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-card text-card-foreground rounded-lg', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 px-2 pb-0 pt-2', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-2 pb-2 pt-2', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center px-2 pb-4 pt-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

const CardImage = React.forwardRef<
  HTMLImageElement,
  Omit<ImageProps, 'alt'> & { alt?: string }
>(({ className, alt = '', ...props }, ref) => (
  <Image
    ref={ref}
    width={500}
    height={500}
    className={cn('h-48 w-full rounded-t-lg object-cover', className)}
    alt={alt}
    {...props}
  />
));
CardImage.displayName = 'CardImage';

export { Card, CardHeader, CardContent, CardFooter, CardImage };
