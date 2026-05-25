import type { Measurement } from '../../logic/parser';
import { formatDateTime } from '../../helpers/date-time';
import { DropdownSelect } from './DropdownSelect';
import { Heading } from '../wrappers/Heading';
import { joinClassNames } from '../wrappers/shared';
import {
  getMeasurementMetric,
  measurementMetrics,
  type MeasurementMetricKey,
} from './measurement-metrics';

type ChartPoint = {
  dateLabel: string;
  key: string;
  value: number;
  x: number;
  y: number;
};

type TrendChartProps = {
  className?: string;
  measurements: Measurement[];
  metricKey: MeasurementMetricKey;
  onMetricKeyChange?: (metricKey: MeasurementMetricKey) => void;
  title?: string;
};

const CHART_WIDTH = 720;
const CHART_HEIGHT = 280;
const PADDING = {
  bottom: 42,
  left: 56,
  right: 18,
  top: 20,
};
const numberFormat = new Intl.NumberFormat('en', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

function formatMetricValue(value: number, unit: string): string {
  const formattedValue = numberFormat.format(value);

  return unit === '' ? formattedValue : `${formattedValue} ${unit}`;
}

function createTicks(minValue: number, maxValue: number): number[] {
  if (minValue === maxValue) {
    return [minValue - 1, minValue, minValue + 1];
  }

  const ticks: number[] = [];
  const tickCount = 4;

  for (let tickIndex = 0; tickIndex <= tickCount; tickIndex += 1) {
    const ratio = tickIndex / tickCount;
    ticks.push(minValue + (maxValue - minValue) * ratio);
  }

  return ticks;
}

export function TrendChart({
  className,
  measurements,
  metricKey,
  onMetricKeyChange,
  title = 'Trend',
}: TrendChartProps) {
  const metric = getMeasurementMetric(metricKey);
  const chartMeasurements = measurements
    .map((measurement) => ({
      measuredAt: measurement.measuredAt,
      value: metric.getValue(measurement),
    }))
    .filter(
      (point): point is { measuredAt: Date; value: number } =>
        point.value !== null,
    )
    .sort(
      (currentPoint, nextPoint) =>
        currentPoint.measuredAt.getTime() - nextPoint.measuredAt.getTime(),
    );
  const values = chartMeasurements.map((point) => point.value);
  const hasEnoughPoints = values.length >= 2;
  const minValue = values.length === 0 ? 0 : Math.min(...values);
  const maxValue = values.length === 0 ? 0 : Math.max(...values);
  const paddingValue = minValue === maxValue ? 1 : (maxValue - minValue) * 0.12;
  const yMin = minValue - paddingValue;
  const yMax = maxValue + paddingValue;
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const ticks = createTicks(yMin, yMax);
  const points: ChartPoint[] = chartMeasurements.map((point, pointIndex) => {
    const xRatio =
      chartMeasurements.length === 1
        ? 0.5
        : pointIndex / (chartMeasurements.length - 1);
    const yRatio = yMax === yMin ? 0.5 : (point.value - yMin) / (yMax - yMin);

    return {
      dateLabel: formatDateTime(point.measuredAt),
      key: point.measuredAt.toISOString(),
      value: point.value,
      x: PADDING.left + plotWidth * xRatio,
      y: PADDING.top + plotHeight * (1 - yRatio),
    };
  });
  const linePath = points
    .map((point, pointIndex) => {
      const command = pointIndex === 0 ? 'M' : 'L';

      return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(' ');
  const firstPoint = points[0] ?? null;
  const lastPoint = points[points.length - 1] ?? null;

  return (
    <section
      className={joinClassNames(
        'overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Heading as="h3" size="sm">
            {title}
          </Heading>
          <p className="mt-1 text-[13px] font-medium text-text-muted">
            {metric.label} over time
          </p>
        </div>

        {onMetricKeyChange === undefined ? null : (
          <DropdownSelect
            label="Metric"
            onSelectedValueChange={onMetricKeyChange}
            options={measurementMetrics.map((currentMetric) => ({
              label: currentMetric.label,
              value: currentMetric.key,
            }))}
            selectedValue={metricKey}
          />
        )}
      </div>

      <div className="px-3 py-4 sm:px-4">
        <div className="relative min-h-[260px]">
          {values.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted px-4 text-center text-sm font-medium text-text-muted">
              No {metric.label.toLowerCase()} values available for this user.
            </div>
          ) : (
            <svg
              aria-label={`${metric.label} trend chart`}
              className="block h-auto w-full overflow-visible"
              role="img"
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            >
              <title>{`${metric.label} trend`}</title>
              <desc>
                {hasEnoughPoints
                  ? `${values.length} measurements from ${
                      firstPoint?.dateLabel ?? ''
                    } to ${lastPoint?.dateLabel ?? ''}.`
                  : 'One measurement available.'}
              </desc>
              {ticks.map((tick) => {
                const yRatio = yMax === yMin ? 0.5 : (tick - yMin) / (yMax - yMin);
                const y = PADDING.top + plotHeight * (1 - yRatio);

                return (
                  <g key={tick.toFixed(4)}>
                    <line
                      stroke="var(--chart-grid)"
                      strokeWidth="1"
                      x1={PADDING.left}
                      x2={CHART_WIDTH - PADDING.right}
                      y1={y}
                      y2={y}
                    />
                    <text
                      className="numeric fill-text-muted text-[12px]"
                      dominantBaseline="middle"
                      textAnchor="end"
                      x={PADDING.left - 10}
                      y={y}
                    >
                      {formatMetricValue(tick, metric.unit)}
                    </text>
                  </g>
                );
              })}
              <line
                stroke="var(--chart-axis)"
                strokeWidth="1.25"
                x1={PADDING.left}
                x2={PADDING.left}
                y1={PADDING.top}
                y2={CHART_HEIGHT - PADDING.bottom}
              />
              <line
                stroke="var(--chart-axis)"
                strokeWidth="1.25"
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={CHART_HEIGHT - PADDING.bottom}
                y2={CHART_HEIGHT - PADDING.bottom}
              />
              {hasEnoughPoints ? (
                <path
                  d={linePath}
                  fill="none"
                  stroke={metric.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              ) : null}
              {points.map((point) => (
                <g key={point.key}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="var(--surface)"
                    r="4.5"
                    stroke={metric.color}
                    strokeWidth="2.5"
                  >
                    <title>
                      {`${point.dateLabel}: ${formatMetricValue(
                        point.value,
                        metric.unit,
                      )}`}
                    </title>
                  </circle>
                </g>
              ))}
              {firstPoint === null ? null : (
                <text
                  className="numeric fill-text-muted text-[12px]"
                  textAnchor="start"
                  x={PADDING.left}
                  y={CHART_HEIGHT - 10}
                >
                  {firstPoint.dateLabel}
                </text>
              )}
              {lastPoint === null || lastPoint.key === firstPoint?.key ? null : (
                <text
                  className="numeric fill-text-muted text-[12px]"
                  textAnchor="end"
                  x={CHART_WIDTH - PADDING.right}
                  y={CHART_HEIGHT - 10}
                >
                  {lastPoint.dateLabel}
                </text>
              )}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
