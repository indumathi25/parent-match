import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatValue } from '../utils/index.ts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const API_PATHS = {
  DATA: '/api/v1/borrowing-rates/data',
  INGEST: '/api/v1/borrowing-rates/ingest',
};

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#1e4bad',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#1e4bad',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      cornerRadius: 2,
      callbacks: {
        title: () => '',
        label: (ctx: any) => `${ctx.label}: ${formatValue(ctx.raw)}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: '#e5e7eb',
        drawTicks: true,
        drawOnChartArea: true,
      },
      border: { dash: [2, 2] },
      ticks: {
        maxTicksLimit: 15,
        color: '#5e6b7e',
        font: { size: 11 },
        callback: function (val: any) {
          const label = (this as any).getLabelForValue(val);
          if (label && label.startsWith('Jan')) {
            return label.split(' ')[1];
          }
          return null;
        }
      },
    },
    y: {
      grid: { display: true, color: '#f3f4f6', borderDash: [2, 2] },
      border: { display: false },
      ticks: {
        color: '#5e6b7e',
        font: { size: 11 },
        callback: (val: any) => formatValue(val),
      },
    },
  },
  layout: {
    padding: {
      left: 40
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart' as const,
  },
  animations: {
    y: {
      from: (ctx: any) => (ctx.type === 'data' ? ctx.chart.scales.y.getPixelForValue(0) : undefined),
      duration: 2000,
    },
    x: {
      from: (ctx: any) => (ctx.type === 'data' ? ctx.chart.scales.x.getPixelForValue(0) : undefined),
      delay: (ctx: any) => {
        if (ctx.type === 'data' && ctx.mode === 'default' && !ctx.active) {
          return ctx.dataIndex * 3;
        }
        return 0;
      },
    },
  },
  transitions: {
    active: {
      animation: {
        duration: 400
      }
    }
  },
  interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
};

export const CROSSHAIR_PLUGIN = {
  id: 'crosshair',
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const { ctx } = chart;
      const { x, y } = activePoint.element;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      const leftX = chart.scales.x.left;
      const rightX = chart.scales.x.right;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);

      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);

      ctx.stroke();
      ctx.restore();
    }
  }
};

