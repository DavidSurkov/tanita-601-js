import { useNavigate } from "react-router";
import { Badge } from "../ui/Badge";
import { MetricCard } from "../ui/MetricCard";
import { TrendChart } from "../ui/TrendChart";
import { Heading } from "../wrappers/Heading";
import { Stack } from "../wrappers/Stack";
import { Text } from "../wrappers/Text";
import { useUserMeasurements } from "../../context";
import { useHandleTanitaFolderOpen } from "../../hooks/useHandleTanitaFolderOpen";

const numberFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { userMeasurements } = useUserMeasurements();
  const onFolderPickBtnClick = useHandleTanitaFolderOpen();
  const latestUser = userMeasurements.find(
    (user) => user.measurements.length > 0,
  );
  const latestMeasurement = latestUser?.measurements[0] ?? null;

  return (
    <Stack gap="lg">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Stack align="start" gap="xs">
          <Heading as="h2" size="md">
            Dashboard
          </Heading>
          <Text>
            {userMeasurements.length === 0
              ? "No folder imported in this session"
              : `${userMeasurements.length} local users ready`}
          </Text>
        </Stack>
        <Badge tone={userMeasurements.length === 0 ? "warning" : "good"}>
          {userMeasurements.length === 0
            ? "Waiting for import"
            : "Local data loaded"}
        </Badge>
      </section>

      {latestMeasurement === null ? (
        <section
          onClick={onFolderPickBtnClick}
          className="rounded-lg border border-border bg-surface p-5 shadow-(--shadow-sm) cursor-pointer"
        >
          <Stack gap="sm">
            <Heading as="h3" size="sm">
              Import GRAPHV1 files
            </Heading>
            <Text>
              Choose the Tanita export folder from the header to populate the
              dashboard.
            </Text>
          </Stack>
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Weight"
              measuredAt={formatDate(latestMeasurement.measuredAt)}
              trend="Latest"
              unit="kg"
              value={numberFormat.format(latestMeasurement.weightKg)}
            />
            <MetricCard
              label="Body Fat"
              measuredAt={formatDate(latestMeasurement.measuredAt)}
              trend="Latest"
              unit="%"
              value={numberFormat.format(latestMeasurement.fatPercent)}
            />
            <MetricCard
              label="Body Water"
              measuredAt={formatDate(latestMeasurement.measuredAt)}
              trend="Latest"
              unit="%"
              value={
                latestMeasurement.waterPercent === null
                  ? "-"
                  : numberFormat.format(latestMeasurement.waterPercent)
              }
            />
            <MetricCard
              label="BMI"
              measuredAt={formatDate(latestMeasurement.measuredAt)}
              trend="Latest"
              value={numberFormat.format(latestMeasurement.bmi)}
            />
          </section>

          {latestUser === undefined ? null : (
            <TrendChart
              measurements={latestUser.measurements}
              metricKey="weight"
              title="Latest User Trend"
            />
          )}
        </>
      )}

      {!!userMeasurements.length && (
        <section className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]">
          <div className="border-b border-border px-4 py-3">
            <Heading as="h3" size="sm">
              Imported Users
            </Heading>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-table-header text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Measurements</th>
                  <th className="px-4 py-3 font-semibold">Latest</th>
                  <th className="px-4 py-3 font-semibold">Height</th>
                </tr>
              </thead>
              <tbody>
                {userMeasurements.map((user) => {
                  const latest = user.measurements[0] ?? null;

                  return (
                    <tr
                      className="border-t border-border hover:bg-table-row-hover cursor-pointer"
                      key={user.id}
                      onClick={() => {
                        navigate(`/users/${user.id}`);
                      }}
                    >
                      <td className="px-4 py-3 font-semibold text-primary">
                        User {user.id}
                      </td>
                      <td className="numeric px-4 py-3">
                        {user.measurements.length}
                      </td>
                      <td className="numeric px-4 py-3">
                        {latest === null ? "-" : formatDate(latest.measuredAt)}
                      </td>
                      <td className="numeric px-4 py-3">
                        {user.profile.heightCm} cm
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Stack>
  );
}
