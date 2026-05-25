import type { Measurement } from '../../logic/parser';

export type MeasurementMetricKey =
  | 'weight'
  | 'fat'
  | 'muscle'
  | 'water'
  | 'bmi'
  | 'bone'
  | 'metabolicAge';

export type MeasurementMetric = {
  color: string;
  getValue(measurement: Measurement): number | null;
  key: MeasurementMetricKey;
  label: string;
  unit: string;
};

export const measurementMetrics: MeasurementMetric[] = [
  {
    color: 'var(--chart-weight)',
    getValue: (measurement) => measurement.weightKg,
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
  },
  {
    color: 'var(--chart-fat)',
    getValue: (measurement) => measurement.fatPercent,
    key: 'fat',
    label: 'Body Fat',
    unit: '%',
  },
  {
    color: 'var(--chart-muscle)',
    getValue: (measurement) => measurement.musclePercent,
    key: 'muscle',
    label: 'Muscle',
    unit: '%',
  },
  {
    color: 'var(--chart-water)',
    getValue: (measurement) => measurement.waterPercent,
    key: 'water',
    label: 'Water',
    unit: '%',
  },
  {
    color: 'var(--chart-bmi)',
    getValue: (measurement) => measurement.bmi,
    key: 'bmi',
    label: 'BMI',
    unit: '',
  },
  {
    color: 'var(--chart-bone)',
    getValue: (measurement) => measurement.boneKg,
    key: 'bone',
    label: 'Bone',
    unit: 'kg',
  },
  {
    color: 'var(--chart-metabolic-age)',
    getValue: (measurement) => measurement.metabolicAgeYears,
    key: 'metabolicAge',
    label: 'Metabolic Age',
    unit: 'years',
  },
];

export function getMeasurementMetric(
  metricKey: MeasurementMetricKey,
): MeasurementMetric {
  const metric = measurementMetrics.find(
    (currentMetric) => currentMetric.key === metricKey,
  );

  if (metric === undefined) {
    throw new Error(`Unknown measurement metric: ${metricKey}`);
  }

  return metric;
}
