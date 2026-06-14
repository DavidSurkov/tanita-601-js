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
const EMPTY_CHART_MIN_HEIGHT_CLASS = 'min-h-[260px]';
const MIN_POINTS_FOR_TREND_LINE = 2;
const SINGLE_POINT_COUNT = 1;
const FIRST_POINT_INDEX = 0;
const LAST_POINT_OFFSET = 1;
const TICK_INDEX_START = 0;
const TICK_INDEX_STEP = 1;
const TICK_COUNT = 4;
const TICK_KEY_FRACTION_DIGITS = 4;
const SVG_COORDINATE_FRACTION_DIGITS = 2;
const SVG_VIEW_BOX_ORIGIN = 0;
const EMPTY_MEASUREMENT_COUNT = 0;
const EMPTY_MEASUREMENT_VALUE = 0;
const RATIO_MAX = 1;
const SINGLE_POINT_AXIS_RATIO = 0.5;
const EQUAL_VALUE_PADDING = 1;
const VALUE_RANGE_PADDING_RATIO = 0.12;
const GRID_STROKE_WIDTH = 1;
const AXIS_STROKE_WIDTH = 1.25;
const TREND_LINE_STROKE_WIDTH = 3;
const POINT_RADIUS = 4.5;
const POINT_STROKE_WIDTH = 2.5;
const AXIS_LABEL_OFFSET = 10;
const VALUE_FORMAT_MAX_FRACTION_DIGITS = 1;
const VALUE_FORMAT_MIN_FRACTION_DIGITS = 0;
const CHART_LABEL_TEXT_CLASS = 'numeric fill-text-muted text-[12px]';
const PADDING = {
  bottom: 42,
  left: 56,
  right: 18,
  top: 20,
};
const numberFormat = new Intl.NumberFormat('en', {
  maximumFractionDigits: VALUE_FORMAT_MAX_FRACTION_DIGITS,
  minimumFractionDigits: VALUE_FORMAT_MIN_FRACTION_DIGITS,
});

function formatMetricValue(value: number, unit: string): string {
  const formattedValue = numberFormat.format(value);

  return unit === '' ? formattedValue : `${formattedValue} ${unit}`;
}

function createTicks(minValue: number, maxValue: number): number[] {
  if (minValue === maxValue) {
    return [
      minValue - EQUAL_VALUE_PADDING,
      minValue,
      minValue + EQUAL_VALUE_PADDING,
    ];
  }

  const ticks: number[] = [];

  for (
    let tickIndex = TICK_INDEX_START;
    tickIndex <= TICK_COUNT;
    tickIndex += TICK_INDEX_STEP
  ) {
    const ratio = tickIndex / TICK_COUNT;
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
  const hasEnoughPoints = values.length >= MIN_POINTS_FOR_TREND_LINE;
  const minValue =
    values.length === EMPTY_MEASUREMENT_COUNT
      ? EMPTY_MEASUREMENT_VALUE
      : Math.min(...values);
  const maxValue =
    values.length === EMPTY_MEASUREMENT_COUNT
      ? EMPTY_MEASUREMENT_VALUE
      : Math.max(...values);
  const paddingValue =
    minValue === maxValue
      ? EQUAL_VALUE_PADDING
      : (maxValue - minValue) * VALUE_RANGE_PADDING_RATIO;
  const yMin = minValue - paddingValue;
  const yMax = maxValue + paddingValue;
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const ticks = createTicks(yMin, yMax);
  const points: ChartPoint[] = chartMeasurements.map((point, pointIndex) => {
    const lastPointIndex = chartMeasurements.length - LAST_POINT_OFFSET;
    const xRatio =
      chartMeasurements.length === SINGLE_POINT_COUNT
        ? SINGLE_POINT_AXIS_RATIO
        : pointIndex / lastPointIndex;
    const yRatio =
      yMax === yMin
        ? SINGLE_POINT_AXIS_RATIO
        : (point.value - yMin) / (yMax - yMin);

    return {
      dateLabel: formatDateTime(point.measuredAt),
      key: point.measuredAt.toISOString(),
      value: point.value,
      x: PADDING.left + plotWidth * xRatio,
      y: PADDING.top + plotHeight * (RATIO_MAX - yRatio),
    };
  });
  const linePath = points
    .map((point, pointIndex) => {
      const command = pointIndex === FIRST_POINT_INDEX ? 'M' : 'L';

      return `${command} ${point.x.toFixed(
        SVG_COORDINATE_FRACTION_DIGITS,
      )} ${point.y.toFixed(SVG_COORDINATE_FRACTION_DIGITS)}`;
    })
    .join(' ');
  const firstPoint = points[FIRST_POINT_INDEX] ?? null;
  const lastPoint = points[points.length - LAST_POINT_OFFSET] ?? null;

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
        <div className={`relative ${EMPTY_CHART_MIN_HEIGHT_CLASS}`}>
          {values.length === EMPTY_MEASUREMENT_COUNT ? (
            <div
              className={joinClassNames(
                'flex items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted px-4 text-center text-sm font-medium text-text-muted',
                EMPTY_CHART_MIN_HEIGHT_CLASS,
              )}
            >
              No {metric.label.toLowerCase()} values available for this user.
            </div>
          ) : (
            <svg
              aria-label={`${metric.label} trend chart`}
              className="block h-auto w-full overflow-visible"
              role="img"
              viewBox={`${SVG_VIEW_BOX_ORIGIN} ${SVG_VIEW_BOX_ORIGIN} ${CHART_WIDTH} ${CHART_HEIGHT}`}
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
                const yRatio =
                  yMax === yMin
                    ? SINGLE_POINT_AXIS_RATIO
                    : (tick - yMin) / (yMax - yMin);
                const y = PADDING.top + plotHeight * (RATIO_MAX - yRatio);

                return (
                  <g key={tick.toFixed(TICK_KEY_FRACTION_DIGITS)}>
                    <line
                      stroke="var(--chart-grid)"
                      strokeWidth={GRID_STROKE_WIDTH}
                      x1={PADDING.left}
                      x2={CHART_WIDTH - PADDING.right}
                      y1={y}
                      y2={y}
                    />
                    <text
                      className={CHART_LABEL_TEXT_CLASS}
                      dominantBaseline="middle"
                      textAnchor="end"
                      x={PADDING.left - AXIS_LABEL_OFFSET}
                      y={y}
                    >
                      {formatMetricValue(tick, metric.unit)}
                    </text>
                  </g>
                );
              })}
              <line
                stroke="var(--chart-axis)"
                strokeWidth={AXIS_STROKE_WIDTH}
                x1={PADDING.left}
                x2={PADDING.left}
                y1={PADDING.top}
                y2={CHART_HEIGHT - PADDING.bottom}
              />
              <line
                stroke="var(--chart-axis)"
                strokeWidth={AXIS_STROKE_WIDTH}
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
                  strokeWidth={TREND_LINE_STROKE_WIDTH}
                />
              ) : null}
              {points.map((point) => (
                <g key={point.key}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="var(--surface)"
                    r={POINT_RADIUS}
                    stroke={metric.color}
                    strokeWidth={POINT_STROKE_WIDTH}
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
                  className={CHART_LABEL_TEXT_CLASS}
                  textAnchor="start"
                  x={PADDING.left}
                  y={CHART_HEIGHT - AXIS_LABEL_OFFSET}
                >
                  {firstPoint.dateLabel}
                </text>
              )}
              {lastPoint === null || lastPoint.key === firstPoint?.key ? null : (
                <text
                  className={CHART_LABEL_TEXT_CLASS}
                  textAnchor="end"
                  x={CHART_WIDTH - PADDING.right}
                  y={CHART_HEIGHT - AXIS_LABEL_OFFSET}
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
