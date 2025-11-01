'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  isWithinInterval,
  format,
} from 'date-fns';
import ChartFilter from './ChartFilter';
import { useTransactionHistory } from '~/hooks/transactionController';

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
  const [filteredData, setFilteredData] = useState<
    { date: string; eth: number }[]
  >([]);

  const { data: transaction, isLoading } = useTransactionHistory();

  const range = periods[selectedPeriod]();

  useEffect(() => {
    if (!transaction?.earnings) {
      setFilteredData([]);
      return;
    }

    const processedData = transaction.earnings
      .filter((item) => item.eventType === 'earning' && item.amount)
      .map((item) => ({
        ...item,
        parsedDate: item.timestamp,
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
        eth: parseFloat(item.amount ?? '0'),
      }));

    setFilteredData(processedData);
  }, [transaction, selectedPeriod, range.start, range.end]);

  const maxValue = 0.24;
  const tickCount = 6;
  const tickStep = maxValue / (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => i * tickStep);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white md:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-base font-semibold">Earning History</h2>
          <ChartFilter value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-sm text-gray-500">Loading earning data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-base font-semibold">Earning History</h2>
        <ChartFilter value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {filteredData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">
              No earning data available for {selectedPeriod.toLowerCase()}
            </div>
          </div>
        </div>
      ) : (
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
                  typeof value === 'number'
                    ? value
                    : parseFloat(value as string);
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
      )}
    </div>
  );
};
