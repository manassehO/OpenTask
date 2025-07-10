'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { earningData } from '~/mocks/userEarning';
import { useState } from 'react';
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  parseISO,
  isWithinInterval,
  format,
} from 'date-fns';
import ChartFilter from './ChartFilter';

const periods = {
  'This Week': () => ({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }),
  'Last Week': () => {
    const lastWeek = subWeeks(new Date(), 1);
    return {
      start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
      end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
    };
  },
};

export const EarningChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'This Week' | 'Last Week'
  >('This Week');

  const range = periods[selectedPeriod]();

  const filteredData = earningData
    .map((item) => ({
      ...item,
      parsedDate: parseISO(item.date),
    }))
    .filter((item) =>
      isWithinInterval(item.parsedDate, {
        start: range.start,
        end: range.end,
      }),
    )
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .map((item) => ({
      date: format(item.parsedDate, 'MMM d'),
      eth: item.eth,
    }));

  const maxValue = 0.24;
  const tickCount = 6;
  const tickStep = maxValue / (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => i * tickStep);

  return (
    <div className="rounded-2xl bg-white md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-base font-semibold">Earning History</h2>
        <ChartFilter value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <YAxis
            tick={{
              fontSize: 12,
              style: { whiteSpace: 'nowrap' },
            }}
            domain={[0, maxValue]}
            ticks={ticks}
            tickFormatter={(v: number) => `${v.toFixed(2)}\u00A0ETH`}
            axisLine={false}
            tickLine={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            formatter={(value) => {
              const val =
                typeof value === 'number' ? value : parseFloat(value as string);
              return [`${val.toFixed(2)} ETH`, 'Earnings'];
            }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
            }}
          />
          <Bar
            dataKey="eth"
            fill="#3B82F6"
            radius={[8, 8, 8, 8]}
            barSize={12}
            background={{ fill: '#EEEEEE', radius: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
