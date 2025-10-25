'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useGetProfile, useUpdateProfile } from '~/hooks/useUpdateProfile';
import {
  useGetNotifications,
  useClearAllNotifications,
  useMarkNotificationRead,
} from '~/hooks/useNotifications';

// Form validation schema
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['male', 'female'], {
    message: 'Please select a gender',
  }),
  niche: z.string().min(1, 'Please select a preferred niche'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Notifications'>(
    'Profile',
  );
  const [updateProfileForm, setUpdateProfileForm] = useState<boolean>(false);

  // Use hooks - REMOVED DUPLICATE DECLARATIONS
  const { updateProfile, isPending } = useUpdateProfile();
  const { profile, isLoading: profileLoading } = useGetProfile();
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotifications();
  const { mutate: clearAllNotifications, isPending: isClearingNotifications } =
    useClearAllNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();

  const notifications = notificationsData?.notifications ?? [];

  const [profileImage, setProfileImage] = useState<string | null>(
    profile?.image ?? null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.name ?? '',
      // phoneNumber: profile?.profile?.phoneNumber ?? '',
      gender: (profile?.profile?.gender as 'male' | 'female') ?? undefined,
      niche: profile?.profile?.niche ?? '',
    },
  });

  watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Form submission handler
  const onSubmit = (data: ProfileFormData) => {
    updateProfile(
      {
        name: data.fullName,
        displayName: data.fullName,
        // phoneNumber: data.phoneNumber,
        gender: data.gender,
        niche: data.niche,
        image: profileImage ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully');
          setUpdateProfileForm(false);
        },
        onError: (error) => {
          console.error('Failed to update profile:', error);
          toast.error('Failed to update profile');
        },
      },
    );
  };

  // Handle clear all notifications - IMPROVED
  const handleClearAll = () => {
    clearAllNotifications(undefined, {
      // or just clearAllNotifications() if your mutation takes no parameters
      onSuccess: () => {
        toast.success('All notifications cleared');
        void refetchNotifications();
      },
      onError: (error: unknown) => {
        console.error('Failed to clear notifications:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to clear notifications';
        toast.error(errorMessage);
      },
    });
  };

  // Handle marking notification as read - IMPROVED
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(
      { notificationIds: [notificationId] },
      {
        onSuccess: () => {
          void refetchNotifications();
          // Optional: Show success toast for better UX
          // toast.success('Notification marked as read');
        },
        onError: (error: unknown) => {
          console.error('Failed to mark notification as read:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to mark as read';
          toast.error(errorMessage); // Consistent error handling
        },
      },
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_approved':
        return '/icons/addTask.svg';
      case 'task_rejected':
        return '/icons/cancelTask.svg';
      case 'payment':
        return '/icons/wallet.svg';
      case 'system':
        return '/icons/notification.svg';
      default:
        return '/icons/addTask.svg';
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8">
      <h1 className="mb-4 font-bold capitalize md:text-[28px] md:text-xl">
        settings
      </h1>

      <div className="mb-4 flex w-full overflow-x-auto bg-white p-2 md:max-w-[274px]">
        {['Profile', 'Notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'Profile' | 'Notifications')}
            className={`w-full rounded-[4px] px-8 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#3B82F6] text-white' : 'text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="h-full w-[680px] max-w-full rounded-lg border bg-white p-4 shadow-sm md:p-6">
        {/* Loading state */}
        {profileLoading && activeTab === 'Profile' && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-gray-600">Loading profile...</p>
            </div>
          </div>
        )}

        {/* Profile Tab - Complete Profile Prompt */}
        {!profileLoading &&
          activeTab === 'Profile' &&
          !profile?.profile?.isProfileComplete &&
          !updateProfileForm && (
            <div className="mx-auto h-full w-full items-center justify-center py-4 text-center md:w-[440px]">
              <div className="flex flex-col items-center justify-center">
                <Image
                  className="mb-4 rounded-full bg-main pt-8 md:h-[200px] md:w-[200px]"
                  width={100}
                  height={100}
                  src={profileImage ?? '/icons/emptyProfile.svg'}
                  alt="Profile"
                />
              </div>

              <h1 className="text-xl font-bold capitalize md:text-[32px]">
                complete profile
              </h1>
              <p className="p-4 text-sm md:text-base">
                Finish setting up your profile—it only takes a minute and helps
                us match you with better tasks.
              </p>

              <div className="w-full pt-4 md:py-8">
                <button
                  onClick={() => setUpdateProfileForm(true)}
                  className="w-full rounded bg-primary p-4 text-sm font-bold capitalize text-white"
                >
                  complete profile
                </button>
              </div>
            </div>
          )}

        {/* Profile Form Details */}
        {activeTab === 'Profile' && updateProfileForm && (
          <div className="py-4">
            <div className="flex flex-col items-center md:flex-row">
              {/* Profile Image */}
              <Image
                className="mb-4 h-[120px] w-[120px] rounded-full bg-main object-cover"
                width={120}
                height={120}
                src={
                  profileImage ?? profile?.image ?? '/icons/emptyProfile.svg'
                }
                alt="Profile"
              />

              {/* Upload Button */}
              <div className="flex w-[123px] cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2 shadow-md md:-ml-8 md:mt-10">
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer gap-1"
                >
                  <Image
                    className="h-4 w-4"
                    width={16}
                    height={16}
                    src="/icons/uploadPhotoIcon.svg"
                    alt="Upload"
                  />
                  <span className="text-xs font-medium capitalize text-primary">
                    add photo
                  </span>
                </label>

                {/* Hidden File Input */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4 md:space-y-6"
            >
              <div className="flex flex-col gap-1 pt-4 text-sm md:text-base">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium capitalize"
                >
                  full name
                </label>
                <input
                  {...register('fullName')}
                  type="text"
                  className={`w-full rounded border p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                  placeholder="enter full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 text-sm md:text-base">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium capitalize"
                >
                  phone number
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className={`w-full rounded border p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                    errors.phoneNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 text-sm md:text-base">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium capitalize"
                >
                  gender
                </label>
                <select
                  {...register('gender')}
                  className={`rounded border bg-white p-3 capitalize outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                    errors.gender ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 text-sm md:text-base">
                <label
                  htmlFor="niche"
                  className="text-sm font-medium capitalize"
                >
                  preferred niche
                </label>
                <select
                  {...register('niche')}
                  className={`rounded border bg-white p-3 capitalize outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                    errors.niche ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">select niche</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Copywriting">Copywriting</option>
                  <option value="SEO">SEO</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Social Media Management">
                    Social Media Management
                  </option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Audio Editing">Audio Editing</option>
                  <option value="Animation">Animation</option>
                  <option value="3D Modeling">3D Modeling</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Blockchain Development">
                    Blockchain Development
                  </option>
                </select>
                {errors.niche && (
                  <p className="text-sm text-red-500">{errors.niche.message}</p>
                )}
              </div>

              <div className="flex w-full justify-end pt-4 md:pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="w-[210px] rounded bg-primary p-4 text-sm font-bold capitalize text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting || isPending ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile View (Completed Profile) */}
        {activeTab === 'Profile' &&
          profile?.profile?.isProfileComplete &&
          !updateProfileForm && (
            <div className="py-4 text-sm font-medium capitalize">
              <div className="flex flex-col items-center gap-4 pt-4 md:flex-row">
                <Image
                  className="h-20 w-20 rounded-full border object-cover"
                  width={80}
                  height={80}
                  src={profile?.image ?? '/icons/emptyProfile.svg'}
                  alt="Profile"
                />

                <div className="flex flex-col text-center md:text-start">
                  <p className="text-lg font-bold md:text-2xl">
                    {profile?.name ?? 'No name set'}
                  </p>
                  <p className="text-xs font-semibold text-primary md:text-sm">
                    {profile?.email ?? 'No email set'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 pt-10 capitalize">
                {/* <div className="space-y-1 rounded bg-main p-5">
                  <p className="text-sm">phone number</p>
                  <p className="text-lg font-medium md:text-2xl">
                    {profile?.profile?.phoneNumber ?? 'Not provided'}
                  </p>
                </div> */}
                <div className="space-y-1 rounded bg-main p-5">
                  <p className="text-sm">gender</p>
                  <p className="text-lg font-medium md:text-2xl">
                    {profile?.profile?.gender ?? 'Not specified'}
                  </p>
                </div>
                <div className="space-y-1 rounded bg-main p-5">
                  <p className="text-sm">preferred niche</p>
                  <p className="text-lg font-medium md:text-2xl">
                    {profile?.profile?.niche ?? 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex w-full justify-end pt-4 md:pt-8">
                <button
                  className="w-[210px] rounded bg-primary p-4 text-sm font-bold capitalize text-white"
                  onClick={() => setUpdateProfileForm(true)}
                >
                  edit profile
                </button>
              </div>
            </div>
          )}

        {/* Notifications Tab */}
        {activeTab === 'Notifications' && (
          <div className="space-y-2 text-xl font-semibold capitalize">
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-gray-600">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : notifications.length > 0 ? (
              <>
                {/* Clear All Button */}
                <div className="flex w-full justify-end pb-4">
                  <button
                    onClick={handleClearAll}
                    disabled={isClearingNotifications}
                    className="rounded text-sm font-bold capitalize text-error disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Image
                      className="mr-2 inline h-4 w-4"
                      width={16}
                      height={16}
                      src="/icons/delete.svg"
                      alt="delete icon"
                    />
                    {isClearingNotifications ? 'Clearing...' : 'clear all'}
                  </button>
                </div>

                {/* Notifications List */}
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className="space-y-4 capitalize"
                  >
                    <div
                      onClick={() =>
                        handleNotificationClick(notification.notificationId)
                      }
                      className={`flex cursor-pointer items-start space-x-4 rounded py-4 transition-all hover:scale-[1.01] md:px-4 md:py-6 ${
                        notification.status === 'READ'
                          ? 'bg-white hover:bg-main'
                          : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="bg-primary-50 flex items-center justify-center rounded md:h-14 md:w-14">
                        <Image
                          width={30}
                          height={30}
                          src={getNotificationIcon(notification.type)}
                          alt="Notification"
                        />
                      </div>

                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold capitalize md:text-xl">
                            {notification.title}
                          </p>
                          {notification.status !== 'READ' && (
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          )}
                        </div>
                        <p className="text-xs font-normal md:text-sm">
                          {notification.message}
                        </p>
                        <p className="text-xs font-normal text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image
                  width={100}
                  height={100}
                  src="/icons/emptyNotification.svg"
                  alt="No notifications"
                  className="mb-4 opacity-50"
                />

                <p className="text-base font-normal text-gray-500">
                  No notifications yet
                </p>
                <p className="text-sm font-normal text-gray-400">
                  You&apos;ll see updates about your tasks here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
