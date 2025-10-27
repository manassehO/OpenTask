'use client';

import { useState } from 'react';
import { AnalyticsFunding } from '~/_components/analytics/AnalyticsFunding';
import { AnalyticsOverview } from '~/_components/analytics/AnalyticsOverview';
import { AnalyticsSubmission } from '~/_components/analytics/AnalyticsSubmission';
import { AnalyticsTabs } from '~/_components/analytics/AnalyticsTabs';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold md:text-xl">Analytics</h1>

      <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'Overview' && <AnalyticsOverview />}
        {activeTab === 'Submissions' && <AnalyticsSubmission />}
        {activeTab === 'Funding' && <AnalyticsFunding />}
      </div>
    </div>
  );
}
