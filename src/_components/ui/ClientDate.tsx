'use client';

import { useEffect, useState } from 'react';
import {
  formatDate,
  formatDateTime,
  getTimeRemaining,
  isExpired,
} from '~/lib/date-utils';

interface ClientDateProps {
  isoString: string | null | undefined;
  format?: 'date' | 'datetime' | 'remaining';
  fallback?: string;
  className?: string;
}

/**
 * Hydration-safe date component that renders dates client-side only
 * Prevents SSR/client mismatch by showing fallback initially
 */
export function ClientDate({
  isoString,
  format = 'date',
  fallback = '...',
  className,
}: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show fallback during SSR and initial hydration
  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  // Client-side rendering with proper date formatting
  let formattedDate: string;

  switch (format) {
    case 'datetime':
      formattedDate = formatDateTime(isoString);
      break;
    case 'remaining':
      formattedDate = getTimeRemaining(isoString);
      break;
    default:
      formattedDate = formatDate(isoString);
  }

  const expired = format === 'remaining' && isExpired(isoString);

  return (
    <span
      className={`${className} ${expired ? 'text-red-500' : ''}`}
      title={isoString ?? 'No date provided'}
    >
      {formattedDate}
    </span>
  );
}

interface ClientDateTimeProps {
  isoString: string | null | undefined;
  className?: string;
}

// Convenience components for common use cases
export function ClientDateOnly({ isoString, className }: ClientDateTimeProps) {
  return (
    <ClientDate isoString={isoString} format="date" className={className} />
  );
}

export function ClientDateTime({ isoString, className }: ClientDateTimeProps) {
  return (
    <ClientDate isoString={isoString} format="datetime" className={className} />
  );
}

export function ClientTimeRemaining({
  isoString,
  className,
}: ClientDateTimeProps) {
  return (
    <ClientDate
      isoString={isoString}
      format="remaining"
      className={className}
    />
  );
}
