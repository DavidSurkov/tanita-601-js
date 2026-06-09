import { Link, useParams } from "react-router";
import { CheckboxDropdown } from "../ui/CheckboxDropdown";
import { Pagination } from "../ui/Pagination";
import { TrendChart } from "../ui/TrendChart";
import type { MeasurementMetricKey } from "../ui/measurement-metrics";
import { Heading } from "../wrappers/Heading";
import { Stack } from "../wrappers/Stack";
import { formatDateTime } from "../../helpers/date-time";
import { useUserMeasurements } from "../../context";
import type { Measurement, UserData } from "../../logic/parser";
import { useEffect, useMemo, useState } from "react";
import { Box } from "../wrappers/Box";
import { Table } from "../ui/Table";

type MeasurementColumnKey = keyof Measurement;

type MeasurementColumn = {
  key: MeasurementColumnKey;
  label: string;
  render(measurement: Measurement): string;
};

const defaultColumnKeys: MeasurementColumnKey[] = [
  "measuredAt",
  "weightKg",
  "bmi",
  "fatPercent",
];

const MEASUREMENTS_PER_PAGE = 10;

const numberFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

const integerFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

const measurementColumns: MeasurementColumn[] = [
  {
    key: "measuredAt",
    label: "Date",
    render: (measurement) => formatDateTime(measurement.measuredAt),
  },
  {
    key: "ageYears",
    label: "Age",
    render: (measurement) => integerFormat.format(measurement.ageYears),
  },
  {
    key: "activityLevelCode",
    label: "Activity Level",
    render: (measurement) =>
      integerFormat.format(measurement.activityLevelCode),
  },
  {
    key: "bodyTypeCode",
    label: "Body Type",
    render: (measurement) => integerFormat.format(measurement.bodyTypeCode),
  },
  {
    key: "weightKg",
    label: "Weight",
    render: (measurement) => `${numberFormat.format(measurement.weightKg)} kg`,
  },
  {
    key: "bmi",
    label: "BMI",
    render: (measurement) => numberFormat.format(measurement.bmi),
  },
  {
    key: "fatPercent",
    label: "Fat",
    render: (measurement) => `${numberFormat.format(measurement.fatPercent)}%`,
  },
  {
    key: "fatRightArmPct",
    label: "Fat Right Arm",
    render: (measurement) =>
      `${numberFormat.format(measurement.fatRightArmPct)}%`,
  },
  {
    key: "fatLeftArmPct",
    label: "Fat Left Arm",
    render: (measurement) =>
      `${numberFormat.format(measurement.fatLeftArmPct)}%`,
  },
  {
    key: "fatRightLegPct",
    label: "Fat Right Leg",
    render: (measurement) =>
      `${numberFormat.format(measurement.fatRightLegPct)}%`,
  },
  {
    key: "fatLeftLegPct",
    label: "Fat Left Leg",
    render: (measurement) =>
      `${numberFormat.format(measurement.fatLeftLegPct)}%`,
  },
  {
    key: "fatTrunkPct",
    label: "Fat Trunk",
    render: (measurement) => `${numberFormat.format(measurement.fatTrunkPct)}%`,
  },
  {
    key: "musclePercent",
    label: "Muscle",
    render: (measurement) => formatOptionalPercent(measurement.musclePercent),
  },
  {
    key: "muscleRightArmPct",
    label: "Muscle Right Arm",
    render: (measurement) =>
      formatOptionalPercent(measurement.muscleRightArmPct),
  },
  {
    key: "muscleLeftArmPct",
    label: "Muscle Left Arm",
    render: (measurement) =>
      formatOptionalPercent(measurement.muscleLeftArmPct),
  },
  {
    key: "muscleRightLegPct",
    label: "Muscle Right Leg",
    render: (measurement) =>
      formatOptionalPercent(measurement.muscleRightLegPct),
  },
  {
    key: "muscleLeftLegPct",
    label: "Muscle Left Leg",
    render: (measurement) =>
      formatOptionalPercent(measurement.muscleLeftLegPct),
  },
  {
    key: "muscleTrunkPct",
    label: "Muscle Trunk",
    render: (measurement) => formatOptionalPercent(measurement.muscleTrunkPct),
  },
  {
    key: "boneKg",
    label: "Bone",
    render: (measurement) => formatOptionalKg(measurement.boneKg),
  },
  {
    key: "waterPercent",
    label: "Water",
    render: (measurement) => formatOptionalPercent(measurement.waterPercent),
  },
  {
    key: "visceralFatRating",
    label: "Visceral Fat",
    render: (measurement) =>
      formatOptionalNumber(measurement.visceralFatRating),
  },
  {
    key: "metabolicAgeYears",
    label: "Metabolic Age",
    render: (measurement) =>
      formatOptionalNumber(measurement.metabolicAgeYears),
  },
  {
    key: "dailyCalorieIntakeKcal",
    label: "Daily Calories",
    render: (measurement) =>
      measurement.dailyCalorieIntakeKcal === null
        ? "-"
        : `${integerFormat.format(measurement.dailyCalorieIntakeKcal)} kcal`,
  },
];

function formatOptionalNumber(value: number | null): string {
  return value === null ? "-" : numberFormat.format(value);
}

function formatOptionalKg(value: number | null): string {
  return value === null ? "-" : `${numberFormat.format(value)} kg`;
}

function formatOptionalPercent(value: number | null): string {
  return value === null ? "-" : `${numberFormat.format(value)}%`;
}

const Tableeee = ({
  measurements,
}: {
  measurements: UserData["measurements"];
}) => {
  const [selectedColumnKeys, setSelectedColumnKeys] =
    useState<MeasurementColumnKey[]>(defaultColumnKeys);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.max(
    1,
    Math.ceil(measurements.length / MEASUREMENTS_PER_PAGE),
  );
  const clampedCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (clampedCurrentPage - 1) * MEASUREMENTS_PER_PAGE;
  const paginatedMeasurements = measurements.slice(
    pageStartIndex,
    pageStartIndex + MEASUREMENTS_PER_PAGE,
  );
  const selectedColumns = useMemo(
    () =>
      measurementColumns.filter((column) =>
        selectedColumnKeys.includes(column.key),
      ),
    [selectedColumnKeys],
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const onSelectedColumnKeysChange = (columnKeys: MeasurementColumnKey[]) => {
    if (columnKeys.length === 0) {
      return;
    }

    setSelectedColumnKeys(columnKeys);
  };

  return (
    <section className="overflow-clip rounded-lg border border-border bg-surface shadow-(--shadow-sm)">
      <Box className="flex justify-between border-b border-border px-4 py-3">
        <Heading as="h3" size="sm">
          Measurements
        </Heading>
        <CheckboxDropdown
          label="Columns"
          onSelectedValuesChange={onSelectedColumnKeysChange}
          options={measurementColumns.map((column) => ({
            label: column.label,
            value: column.key,
          }))}
          selectedValues={selectedColumnKeys}
        />
      </Box>
      <Box className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead className="bg-table-header text-text-muted">
            <tr>
              {selectedColumns.map((column) => (
                <th className="px-4 py-3 font-semibold" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurements.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-5 text-text-muted"
                  colSpan={selectedColumns.length}
                >
                  No measurements imported
                </td>
              </tr>
            ) : (
              paginatedMeasurements.map((measurement) => (
                <tr
                  className="border-t border-border hover:bg-table-row-hover"
                  key={measurement.measuredAt.toISOString()}
                >
                  {selectedColumns.map((column) => (
                    <td className="numeric px-4 py-3" key={column.key}>
                      {column.render(measurement)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
      <Box className="border-t border-border px-4 py-3">
        <Pagination
          currentPage={clampedCurrentPage}
          onPageChange={setCurrentPage}
          pageCount={pageCount}
        />
      </Box>
    </section>
  );
};

export function UserPage() {
  const { userMeasurements } = useUserMeasurements();
  const { userId } = useParams();
  const [selectedMetricKey, setSelectedMetricKey] =
    useState<MeasurementMetricKey>("weight");
  const parsedUserId = Number(userId);
  const user = Number.isInteger(parsedUserId)
    ? userMeasurements.find((currentUser) => currentUser.id === parsedUserId)
    : undefined;
  const sortedMeasurements = useMemo(() => {
    if (user === undefined) {
      return [];
    }

    return [...user.measurements].sort(
      (curr, next) => curr.measuredAt.getTime() - next.measuredAt.getTime(),
    );
  }, [user]);

  return (
    <Stack gap="lg">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Stack align="start" gap="xs">
          <Heading as="h2" size="md">
            User {user ? user.id : "not found"}
          </Heading>
        </Stack>
      </section>
      {!user ? (
        <Link className="text-sm font-semibold text-primary" to="/home">
          Back to home
        </Link>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <Box className="rounded-lg border border-border bg-surface p-4 shadow-(--shadow-sm)">
              <p className="text-sm font-semibold text-text-muted">
                Birth date
              </p>
              <p className="numeric mt-2 text-2xl font-bold text-text">
                {user.profile.birthDate.toDateString()}
              </p>
            </Box>
            <Box className="rounded-lg border border-border bg-surface p-4 shadow-(--shadow-sm)">
              <p className="text-sm font-semibold text-text-muted">Height</p>
              <p className="numeric mt-2 text-2xl font-bold text-text">
                {user.profile.heightCm} cm
              </p>
            </Box>
            <Box className="rounded-lg border border-border bg-surface p-4 shadow-(--shadow-sm)">
              <p className="text-sm font-semibold text-text-muted">Gender</p>
              <p className="mt-2 text-2xl font-bold capitalize text-text">
                {String(user.profile.gender)}
              </p>
            </Box>
          </section>

          <TrendChart
            measurements={sortedMeasurements}
            metricKey={selectedMetricKey}
            onMetricKeyChange={setSelectedMetricKey}
            title="Trend Graph"
          />

          <Table
            records={sortedMeasurements}
            columns={measurementColumns}
            initialColumnKeys={defaultColumnKeys}
            title="Measurements"
            recordsPerPage={MEASUREMENTS_PER_PAGE}
          />
        </>
      )}
    </Stack>
  );
}
