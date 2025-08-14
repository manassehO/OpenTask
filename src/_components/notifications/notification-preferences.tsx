'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, X, Settings } from 'lucide-react';
import { api } from '~/trpc/react';

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskUpdates: boolean;
  paymentNotifications: boolean;
  disputeNotifications: boolean;
  learningNotifications: boolean;
  marketingEmails: boolean;
}

interface PreferenceGroup {
  title: string;
  description?: string;
  preferences: Array<{
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }>;
}

const PREFERENCE_GROUPS: PreferenceGroup[] = [
  {
    title: 'Communication',
    description: 'How you receive notifications',
    preferences: [
      {
        key: 'emailNotifications',
        label: 'Email Notifications',
        description: 'Receive notifications via email',
      },
      {
        key: 'pushNotifications',
        label: 'Push Notifications',
        description: 'Receive browser push notifications',
      },
    ],
  },
  {
    title: 'Task & Work',
    description: 'Updates about your tasks and work',
    preferences: [
      {
        key: 'taskUpdates',
        label: 'Task Updates',
        description:
          'Notifications about task status changes, assignments, and deadlines',
      },
      {
        key: 'paymentNotifications',
        label: 'Payment Notifications',
        description: 'Alerts about payments received and payment issues',
      },
      {
        key: 'disputeNotifications',
        label: 'Dispute Notifications',
        description: 'Updates about dispute status and resolutions',
      },
    ],
  },
  {
    title: 'Learning & Growth',
    description: 'Educational content and course updates',
    preferences: [
      {
        key: 'learningNotifications',
        label: 'Learning Notifications',
        description:
          'Course completions, new learning materials, and skill updates',
      },
    ],
  },
  {
    title: 'Marketing',
    description: 'Promotional content and updates',
    preferences: [
      {
        key: 'marketingEmails',
        label: 'Marketing Emails',
        description:
          'Product updates, feature announcements, and promotional content',
      },
    ],
  },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  taskUpdates: true,
  paymentNotifications: true,
  disputeNotifications: true,
  learningNotifications: true,
  marketingEmails: false,
};

export function NotificationPreferences() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    data: preferences,
    isLoading,
    error,
  } = api.notifications.getPreferences.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updatePreferencesMutation =
    api.notifications.updatePreferences.useMutation({
      onSuccess: () => {
        setHasChanges(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      },
      onError: (error) => {
        console.error('Failed to update preferences:', error);
      },
    });

  const [formData, setFormData] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (preferences) {
      const newFormData = {
        emailNotifications:
          preferences.emailNotifications ??
          DEFAULT_PREFERENCES.emailNotifications,
        pushNotifications:
          preferences.pushNotifications ??
          DEFAULT_PREFERENCES.pushNotifications,
        taskUpdates: preferences.taskUpdates ?? DEFAULT_PREFERENCES.taskUpdates,
        paymentNotifications:
          preferences.paymentNotifications ??
          DEFAULT_PREFERENCES.paymentNotifications,
        disputeNotifications:
          preferences.disputeNotifications ??
          DEFAULT_PREFERENCES.disputeNotifications,
        learningNotifications:
          preferences.learningNotifications ??
          DEFAULT_PREFERENCES.learningNotifications,
        marketingEmails:
          preferences.marketingEmails ?? DEFAULT_PREFERENCES.marketingEmails,
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [preferences]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (hasChanges) {
        updatePreferencesMutation.mutate(formData);
      }
    },
    [formData, hasChanges, updatePreferencesMutation],
  );

  const handleToggle = useCallback(
    (key: keyof NotificationPreferences) => {
      setFormData((prev) => {
        const newData = { ...prev, [key]: !prev[key] };
        const hasActualChanges = preferences
          ? Object.keys(newData).some(
              (k) =>
                newData[k as keyof NotificationPreferences] !==
                (preferences[k as keyof NotificationPreferences] ??
                  DEFAULT_PREFERENCES[k as keyof NotificationPreferences]),
            )
          : true;
        setHasChanges(hasActualChanges);
        return newData;
      });
    },
    [preferences],
  );

  const handleReset = useCallback(() => {
    if (preferences) {
      setFormData({
        emailNotifications:
          preferences.emailNotifications ??
          DEFAULT_PREFERENCES.emailNotifications,
        pushNotifications:
          preferences.pushNotifications ??
          DEFAULT_PREFERENCES.pushNotifications,
        taskUpdates: preferences.taskUpdates ?? DEFAULT_PREFERENCES.taskUpdates,
        paymentNotifications:
          preferences.paymentNotifications ??
          DEFAULT_PREFERENCES.paymentNotifications,
        disputeNotifications:
          preferences.disputeNotifications ??
          DEFAULT_PREFERENCES.disputeNotifications,
        learningNotifications:
          preferences.learningNotifications ??
          DEFAULT_PREFERENCES.learningNotifications,
        marketingEmails:
          preferences.marketingEmails ?? DEFAULT_PREFERENCES.marketingEmails,
      });
      setHasChanges(false);
    }
  }, [preferences]);

  const stats = useMemo(() => {
    const totalEnabled = Object.values(formData).filter(Boolean).length;
    const totalPreferences = Object.keys(formData).length;
    return { totalEnabled, totalPreferences };
  }, [formData]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse">
          <div className="mb-2 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="mb-8 h-4 w-1/2 rounded bg-gray-200"></div>
          {Array.from({ length: 4 }, (_, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
              <div className="space-y-4">
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="rounded-lg border bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 h-4 w-1/3 rounded bg-gray-200"></div>
                        <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <X className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-medium text-red-900">
            Failed to load preferences
          </h3>
          <p className="mb-4 text-red-700">
            {error.data?.code === 'UNAUTHORIZED'
              ? 'Please sign in to manage your notification preferences'
              : 'There was an error loading your preferences. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Preferences
          </h1>
        </div>
        <p className="text-gray-600">
          Customize how and when you receive notifications. You have{' '}
          {stats.totalEnabled} of {stats.totalPreferences} notification types
          enabled.
        </p>
      </div>
      {showSuccessMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800">
            Your notification preferences have been saved successfully!
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {PREFERENCE_GROUPS.map((group) => (
          <div
            key={group.title}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {group.title}
              </h3>
              {group.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {group.description}
                </p>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {group.preferences.map((pref) => (
                <div
                  key={pref.key}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-base font-medium text-gray-900">
                        {pref.label}
                      </label>
                      <p className="text-sm text-gray-600">
                        {pref.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(pref.key)}
                      className={`relative ml-6 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData[pref.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
                      aria-pressed={formData[pref.key]}
                      aria-describedby={`${pref.key}-description`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData[pref.key] ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || updatePreferencesMutation.isPending}
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={!hasChanges || updatePreferencesMutation.isPending}
            className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updatePreferencesMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
