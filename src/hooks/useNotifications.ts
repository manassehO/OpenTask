import { useToastContext } from '~/store/ToastProvider';
import { api } from '~/trpc/react';

// Enhanced error handling with type safety
class NotificationError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = 'NotificationError';
  }
}

// Helper function to safely extract error message with better type checking
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    // Handle TRPC errors
    if ('shape' in error && error.shape && typeof error.shape === 'object') {
      const shape = error.shape as { message?: string };
      if (shape.message) return shape.message;
    }

    // Handle standard error objects
    if ('message' in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === 'string') return message;
    }

    // Handle HTTP error responses
    if ('data' in error && error.data && typeof error.data === 'object') {
      const data = error.data as { message?: string };
      if (data.message) return data.message;
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

// Types
export interface Notification {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  relatedTaskId?: string | null;
  metadata?: string | null;
}

// Context type for mutations
interface MutationContext {
  toastId: string;
}

// Query hook for fetching all notifications
export function useGetNotifications() {
  return api.notification.getNotifications.useQuery(
    {},
    {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown): boolean => {
        const message = getErrorMessage(error);
        // Don't retry for specific client errors
        if (message.includes('not found') || message.includes('unauthorized')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  );
}

// Query hook for fetching unread notification count
export function useGetUnreadCount() {
  return api.notification.getUnreadCount.useQuery(undefined, {
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Mutation hook for marking a notification as read
export function useMarkNotificationRead() {
  const utils = api.useUtils();

  return api.notification.markAsRead.useMutation({
    onSuccess: (): void => {
      // Invalidate and refetch notifications
      void utils.notification.getNotifications.invalidate();
      void utils.notification.getUnreadCount.invalidate();
    },

    onError: (
      error: unknown,
      _variables: { notificationIds: string[] },
    ): void => {
      const errorMessage: string = getErrorMessage(error);
      console.error(`Failed to mark notification as read:`, errorMessage);

      throw new NotificationError(
        `Failed to mark notification as read: ${errorMessage}`,
        'MARK_AS_READ_ERROR',
        error,
      );
    },
  });
}

// Mutation hook for marking all notifications as read
export function useMarkAllNotificationsRead() {
  const { showSuccess, showError, showLoading, removeToast } =
    useToastContext();
  const utils = api.useUtils();

  return api.notification.markAllAsRead.useMutation({
    onMutate: (): MutationContext => {
      const toastId: string = showLoading('Updating', 'Marking all as read...');
      return { toastId };
    },
    onSuccess: async (
      _data: unknown,
      _variables: void,
      context: MutationContext | undefined,
    ): Promise<void> => {
      if (context?.toastId) removeToast(context.toastId);
      showSuccess('Success', 'All notifications marked as read');

      // Use await for invalidations to ensure they complete
      try {
        await Promise.all([
          utils.notification.getNotifications.invalidate(),
          utils.notification.getUnreadCount.invalidate(),
        ]);
      } catch (invalidationError: unknown) {
        console.warn(
          'Cache invalidation failed:',
          getErrorMessage(invalidationError),
        );
      }
    },
    onError: (
      error: unknown,
      _variables: void,
      context: MutationContext | undefined,
    ): void => {
      if (context?.toastId) removeToast(context.toastId);
      const errorMessage: string = getErrorMessage(error);
      showError('Failed to update notifications', errorMessage);

      throw new NotificationError(
        `Failed to mark all notifications as read: ${errorMessage}`,
        'MARK_ALL_READ_ERROR',
        error,
      );
    },
  });
}

// Mutation hook for clearing all notifications
export function useClearAllNotifications() {
  const { showSuccess, showError, showLoading, removeToast } =
    useToastContext();
  const utils = api.useUtils();

  return api.notification.clearAllNotifications.useMutation({
    onMutate: (): MutationContext => {
      const toastId: string = showLoading(
        'Clearing',
        'Removing all notifications...',
      );
      return { toastId };
    },
    onSuccess: async (
      _data: unknown,
      _variables: void,
      context: MutationContext | undefined,
    ): Promise<void> => {
      if (context?.toastId) removeToast(context.toastId);
      showSuccess('Success', 'All notifications cleared');

      try {
        await Promise.all([
          utils.notification.getNotifications.invalidate(),
          utils.notification.getUnreadCount.invalidate(),
        ]);
      } catch (invalidationError: unknown) {
        console.warn(
          'Cache invalidation failed:',
          getErrorMessage(invalidationError),
        );
      }
    },
    onError: (
      error: unknown,
      _variables: void,
      context: MutationContext | undefined,
    ): void => {
      if (context?.toastId) removeToast(context.toastId);
      const errorMessage: string = getErrorMessage(error);
      showError('Failed to clear notifications', errorMessage);

      throw new NotificationError(
        `Failed to clear notifications: ${errorMessage}`,
        'CLEAR_ALL_ERROR',
        error,
      );
    },
  });
}

// Mutation hook for deleting a specific notification
export function useDeleteNotification() {
  const { showSuccess, showError } = useToastContext();
  const utils = api.useUtils();

  return api.notification.deleteNotification.useMutation({
    onSuccess: async (
      _data: unknown,
     
    ): Promise<void> => {
      showSuccess('Success', 'Notification deleted');

      try {
        await Promise.all([
          utils.notification.getNotifications.invalidate(),
          utils.notification.getUnreadCount.invalidate(),
        ]);
      } catch (invalidationError: unknown) {
        console.warn(
          'Cache invalidation failed:',
          getErrorMessage(invalidationError),
        );
      }
    },

    onError: (error: unknown, _variables: unknown): void => {
      const errorMessage: string = getErrorMessage(error);
      showError('Failed to update preferences', errorMessage);

      throw new NotificationError(
        `Failed to update preferences: ${errorMessage}`,
        'UPDATE_PREFERENCES_ERROR',
        error,
      );
    },
  });
}

// Query hook for notification preferences
export function useGetNotificationPreferences() {
  return api.notification.getNotificationPreferences.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Mutation hook for updating notification preferences
export function useUpdateNotificationPreferences() {
  const { showSuccess, showError } = useToastContext();
  const utils = api.useUtils();

  return api.notification.updateNotificationPreferences.useMutation({
    onSuccess: async (): Promise<void> => {
      showSuccess('Success', 'Preferences updated successfully');

      try {
        await utils.notification.getNotificationPreferences.invalidate();
      } catch (invalidationError: unknown) {
        console.warn(
          'Cache invalidation failed:',
          getErrorMessage(invalidationError),
        );
      }
    },

    onError: (error: unknown, _variables: unknown): void => {
      const errorMessage: string = getErrorMessage(error);
      showError('Failed to update preferences', errorMessage);

      throw new NotificationError(
        `Failed to update preferences: ${errorMessage}`,
        'UPDATE_PREFERENCES_ERROR',
        error,
      );
    },
  });
}

// Utility hook for handling multiple notification operations
export function useNotificationActions() {
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const clearAll = useClearAllNotifications();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = async (notificationId: string): Promise<void> => {
    try {
      await markAsRead.mutateAsync({ notificationIds: [notificationId] });
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleClearAll = async (): Promise<void> => {
    try {
      await clearAll.mutateAsync();
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleDeleteNotification = async (
    notificationId: string,
  ): Promise<void> => {
    try {
      await deleteNotification.mutateAsync({ notificationId });
    } catch (error: unknown) {
      throw error;
    }
  };

  return {
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleClearAll,
    handleDeleteNotification,
    isLoading:
      markAsRead.isPending ||
      markAllAsRead.isPending ||
      clearAll.isPending ||
      deleteNotification.isPending,
  };
}
