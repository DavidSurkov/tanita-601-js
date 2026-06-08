import {
  useExport,
  useHandleTanitaFolderOpen,
  useImport,
} from "../../hooks/useHandleTanitaFolderOpen";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Heading } from "../wrappers/Heading";
import { Stack } from "../wrappers/Stack";
import { Text } from "../wrappers/Text";

export function SettingsPage() {
  const onFolderPickBtnClick = useHandleTanitaFolderOpen();
  const onImportBtnClick = useImport();
  const onExportBtnClick = useExport();

  return (
    <Stack gap="lg">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Stack align="start" gap="xs">
          <Heading as="h2" size="md">
            Settings
          </Heading>
          <Text>Local-first preferences</Text>
        </Stack>
        <Badge>Device only</Badge>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
          <Heading as="h3" size="sm">
            Import Source
          </Heading>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onFolderPickBtnClick} variant="primary">
              Open Tanita folder
            </Button>
            <Button onClick={onImportBtnClick}>Import JSON</Button>
            <Button onClick={onExportBtnClick}>Export</Button>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
          <Heading as="h3" size="sm">
            Data Location
          </Heading>
          <Text className="mt-2">
            Imported measurements remain in this browser session.
          </Text>
        </div>
      </section>
    </Stack>
  );
}
