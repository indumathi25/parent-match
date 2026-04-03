import { useMemo, memo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { MainChartProps } from '../types';
import { formatMonthYear } from '../utils';
import { CHART_OPTIONS } from '../constants';

export const MainChart = memo<MainChartProps>(({ data }) => {
  const chartData = useMemo(() => ({
    labels: data.map(d => formatMonthYear(d.period)),
    datasets: [{
      label: 'Interest Rate',
      data: data.map(d => d.value),
      borderColor: '#1e4bad',
      borderWidth: 1.5,
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: '#1e4bad',
      pointHoverBackgroundColor: '#1e4bad',
      fill: false,
      tension: 0.1,
    }],
  }), [data]);

  return (
    <div className="relative h-[300px] md:h-[480px] w-full p-2 md:p-4 pt-8 md:pt-10">
      <div className="hidden lg:block absolute top-[45%] -left-16 -translate-y-1/2 -rotate-90 text-[11px] text-blue-700 font-medium uppercase tracking-widest opacity-80">
        Percent per annum
      </div>
      <div className="h-full w-full">
        <Line data={chartData} options={CHART_OPTIONS as ChartOptions<'line'>} />
      </div>
    </div>
  );
});