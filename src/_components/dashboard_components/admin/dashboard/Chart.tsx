'use client';

import { type FC, useEffect, useRef } from 'react';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import Header from '../header';

Chart.register(...registerables);

//  Interface
interface MonthlySalesData {
  month: string;
  value: number;
}

//  Sample data
const salesData: MonthlySalesData[] = [
  { month: 'Jan ‘25', value: 1000 },
  { month: 'Feb ‘25', value: 1000 },
  { month: 'Mar ‘25', value: 5000 },
  { month: 'Apr ‘25', value: 10000 },
  { month: 'May ‘25', value: 10000 },
  { month: 'Jun ‘25', value: 10000 },
  { month: 'Jul ‘25', value: 20000 },
  { month: 'Aug ‘25', value: 20000 },
  { month: 'Sep ‘25', value: 20000 },
  { month: 'Oct ‘25', value: 40000 },
  { month: 'Nov ‘25', value: 40000 },
  { month: 'Dec ‘25', value: 50000 },
];

//  Component
export const ChartBar: FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = chartRef.current;

    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const labels = salesData.map((item) => item.month);
      const dataValues = salesData.map((item) => item.value);

      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'users',
              data: dataValues,
              backgroundColor: '#3B82F6',
              borderRadius: 4,
              barPercentage: 1,
              categoryPercentage: 0.6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
              padding: 0,
              backgroundColor: '#3B82F6',
              titleColor: '#fff',
              bodyColor: '#fff',
              cornerRadius: 4,
            },
          },
          scales: {
            y: {
              border: { display: true, dash: [9, 7], width: 1 },
              grid: {
                drawTicks: false,
                tickBorderDash: [4, 4],
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                color: '#414141',
                font: { size: 14, weight: 700 },
                padding: 6,
              },
            },
            x: {
              border: { display: true, dash: [3, 4], width: 1 },
              grid: { display: false, drawTicks: false },
              ticks: {
                color: '#414141',
                font: { size: 14, weight: 700 },
                padding: 8,
              },
            },
          },
        },
      };

      chartInstanceRef.current = new Chart(ctx, config);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-6xl space-y-6 rounded bg-white p-10 shadow">
      <Header
        title="user growth"
        subText="Track how your user base is expanding over time."
      />
      <div className="rounded-lg border px-6 py-8 sm:p-14 sm:px-10">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};
