export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return 'No date';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return 'No date';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

export function isExpired(isoString: string | null | undefined): boolean {
  if (!isoString) return false;

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return false;

    return date.getTime() < Date.now();
  } catch {
    return false;
  }
}

export function getTimeRemaining(isoString: string | null | undefined): string {
  if (!isoString) return 'No deadline';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid deadline';

    const now = Date.now();
    const diff = date.getTime() - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
      return 'Less than 1 hour left';
    }
  } catch {
    return 'Invalid deadline';
  }
}
