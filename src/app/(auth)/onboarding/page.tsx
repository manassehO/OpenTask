'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MultiStepWizard, { Step } from '~/_components/ui/multi-step-wizard';
import AuthWrapper from '~/_components/layout/authWrapper';

// Step Components
const WelcomeStep = () => (
  <div className="text-center space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
    >
      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    </motion.div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to OpenTask!</h3>
      <p className="text-gray-600">Let's get you set up with everything you need to start earning and completing tasks.</p>
    </div>
  </div>
);

const ProfileStep = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: []
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your last name"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
};

const PreferencesStep = () => {
  const [preferences, setPreferences] = useState({
    taskTypes: [],
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    availability: 'full-time'
  });

  const taskTypes = [
    { id: 'data-entry', label: 'Data Entry', icon: '📝' },
    { id: 'content-writing', label: 'Content Writing', icon: '✍️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'development', label: 'Development', icon: '💻' },
    { id: 'marketing', label: 'Marketing', icon: '📈' },
    { id: 'research', label: 'Research', icon: '🔍' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">What type of tasks interest you?</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {taskTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                preferences.taskTypes.includes(type.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setPreferences(prev => ({
                  ...prev,
                  taskTypes: prev.taskTypes.includes(type.id)
                    ? prev.taskTypes.filter(t => t !== type.id)
                    : [...prev.taskTypes, type.id]
                }));
              }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-3">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    [key]: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {key} notifications
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompletionStep = () => (
  <div className="text-center space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
    >
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </motion.div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h3>
      <p className="text-gray-600">Your account has been configured. You can now start exploring tasks and earning rewards.</p>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Browse available tasks in your dashboard</li>
        <li>• Complete your first task to earn rewards</li>
        <li>• Invite friends to earn bonus points</li>
      </ul>
    </div>
  </div>
);

function OnboardingPage() {
  const router = useRouter();
  
  const steps: Step[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Let\'s get started with your OpenTask journey',
      component: <WelcomeStep />
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      description: 'Tell us about yourself',
      component: <ProfileStep />
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      component: <PreferencesStep />
    },
    {
      id: 'completion',
      title: 'Complete',
      description: 'You\'re ready to go!',
      component: <CompletionStep />
    }
  ];

  const handleComplete = () => {
    // Save onboarding completion status
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MultiStepWizard
            steps={steps}
            onComplete={handleComplete}
            showProgress={true}
            allowSkip={true}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default OnboardingPage;