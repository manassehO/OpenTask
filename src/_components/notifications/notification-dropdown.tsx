'use client';

import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, Settings, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '~/trpc/react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  notificationId: string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: Date;
}

export function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const {
    data: notificationsData,
    refetch,
    error,
    isLoading,
    isSuccess,
  } = api.notification.getNotifications.useQuery(
    { limit: 20 },
    {
      enabled: isOpen && !isAuthError,
      retry: false,
      staleTime: 30000,
      gcTime: 300000,
    },
  );

  const notifications = notificationsData?.notifications ?? [];

  const markAsReadMutation = api.notification.markAsRead.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const authState = useMemo(() => {
    const hasAuthError = error?.data?.code === 'UNAUTHORIZED';
    const hasAttempted = isSuccess ?? hasAuthError;

    return {
      isAuthError: hasAuthError,
      hasAttempted,
      isLoading: isLoading && !hasAttempted,
    };
  }, [error, isSuccess, isLoading]);

  useEffect(() => {
    setIsAuthError(authState.isAuthError);
  }, [authState.isAuthError]);

  useEffect(() => {
    if (!isOpen) {
      setIsAuthError(false);
    }
  }, [isOpen]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate({ notificationIds: [notificationId] });
    },
    [markAsReadMutation],
  );

  const handleMarkAllAsRead = useCallback(() => {
    const notificationIds = notifications.map((n) => n.notificationId);
    markAsReadMutation.mutate({ notificationIds });
  }, [markAsReadMutation, notifications]);

  const handleSignIn = useCallback(() => {
    console.log('Navigate to sign in');
  }, []);

  if (!isOpen) return null;

  const LoadingState = ({ message }: { message: string }) => (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );

  const AuthErrorState = () => (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close notifications"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-8 text-center text-gray-500">
        <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="mb-4">Please sign in to view notifications</p>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  if (authState.isLoading) {
    return <LoadingState message="Checking notifications..." />;
  }

  if (authState.isAuthError && authState.hasAttempted) {
    return <AuthErrorState />;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-50 mt-2 max-h-96 w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-800 disabled:opacity-50"
              disabled={markAsReadMutation.isPending}
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {isLoading && authState.hasAttempted ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification: Notification) => (
            <NotificationItem
              key={notification.notificationId}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              isMarkingAsRead={markAsReadMutation.isPending}
            />
          ))
        )}
      </div>
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <button
          className="flex w-full items-center justify-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open notification settings"
        >
          <Settings className="h-4 w-4" />
          Notification Settings
        </button>
      </div>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: NotificationItemProps) => {
  const isUnread = notification.status === 'UNREAD';

  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(notification.notificationId);
  }, [notification.notificationId, onMarkAsRead]);

  return (
    <div
      className={`border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${isUnread ? 'bg-blue-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            {isUnread && (
              <span
                className="h-2 w-2 rounded-full bg-blue-500"
                aria-label="Unread notification"
              ></span>
            )}
          </div>
          <p className="mb-2 text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        {isUnread && (
          <button
            onClick={handleMarkAsRead}
            className="ml-2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
            disabled={isMarkingAsRead}
            aria-label="Mark notification as read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
