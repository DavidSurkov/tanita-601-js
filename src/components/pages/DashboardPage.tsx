import { NavLink } from "react-router";
import { Badge } from "../ui/Badge";
import { Heading } from "../wrappers/Heading";
import { Stack } from "../wrappers/Stack";
import { Text } from "../wrappers/Text";
import { useUserMeasurements } from "../../context";
import { useHandleTanitaFolderOpen } from "../../hooks/useHandleTanitaFolderOpen";
import { formatDate } from "../../helpers/date-time";
import { Table } from "../ui/Table";

export function DashboardPage() {
  const { userMeasurements } = useUserMeasurements();
  const onFolderPickBtnClick = useHandleTanitaFolderOpen();

  return (
    <Stack gap="lg">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Stack align="start" gap="xs">
          <Heading as="h2" size="md">
            Dashboard
          </Heading>
        </Stack>
        <Badge tone={userMeasurements.length === 0 ? "warning" : "good"}>
          {userMeasurements.length === 0
            ? "Waiting for import"
            : "Local data loaded"}
        </Badge>
      </section>

      {!userMeasurements.length ? (
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
        <Table
          recordsPerPage={5}
          title="Imported Users"
          records={userMeasurements}
          columns={[
            {
              render: (user) => formatDate(user.profile.birthDate),
              key: "birthDate",
              label: "BD",
            },

            {
              render: (user) => user.profile.heightCm,
              key: "heightCm",
              label: "Height",
            },

            {
              render: (user) => user.profile.gender,
              key: "gender",
              label: "Gender",
            },

            {
              render: (user) => (
                <NavLink to={`/users/${user.id}`}>{"--->"}</NavLink>
              ),
              key: "goto",
              label: "",
            },
          ]}
          initialColumnKeys={["birthDate", "heightCm", "gender", "goto"]}
        />
      )}
    </Stack>
  );
}
