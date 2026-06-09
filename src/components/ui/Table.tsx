import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Box } from "../wrappers/Box";
import { Heading } from "../wrappers/Heading";
import { CheckboxDropdown } from "./CheckboxDropdown";
import { Pagination } from "./Pagination";
import { fallbackInCaseOfSymbol } from "../../helpers/uuid";

const DEFAULT_RECORDS_PER_PAGE = 10;

type RecordKey<T extends Record<string, unknown>> = keyof T;

type Column<T extends Record<string, unknown>> = {
  key: RecordKey<T> | (string & {});
  label: string;
  render(record: T): ReactNode;
};

export const Table = <T extends Record<string, unknown>, C extends Column<T>>({
  records,
  columns,
  initialColumnKeys,
  title,
  shouldHideColumnsSelect = initialColumnKeys.length === columns.length,
  recordsPerPage = DEFAULT_RECORDS_PER_PAGE,
}: {
  records: T[];
  columns: C[];
  initialColumnKeys: C["key"][];
  recordsPerPage: number;
  shouldHideColumnsSelect?: boolean;
  title?: string;
}) => {
  const [selectedColumnKeys, setSelectedColumnKeys] =
    useState<RecordKey<T>[]>(initialColumnKeys);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(records.length / recordsPerPage));
  const clampedCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (clampedCurrentPage - 1) * recordsPerPage;
  const paginatedRecords = records.slice(
    pageStartIndex,
    pageStartIndex + recordsPerPage,
  );
  const selectedColumns = useMemo(
    () => columns.filter((column) => selectedColumnKeys.includes(column.key)),
    [selectedColumnKeys],
  );

  const shouldRenderPagination = records.length > recordsPerPage;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const onSelectedColumnKeysChange = (columnKeys: RecordKey<T>[]) => {
    if (columnKeys.length === 0) {
      return;
    }

    setSelectedColumnKeys(columnKeys);
  };

  return (
    <section className="overflow-clip rounded-lg border border-border bg-surface shadow-(--shadow-sm)">
      <Box className="flex justify-between border-b border-border px-4 py-3">
        {!!title && (
          <Heading as="h3" size="sm">
            {title}
          </Heading>
        )}
        {!shouldHideColumnsSelect && (
          <CheckboxDropdown
            label="Columns"
            onSelectedValuesChange={onSelectedColumnKeysChange}
            options={columns.map((column) => ({
              label: column.label,
              value: column.key,
            }))}
            selectedValues={selectedColumnKeys}
          />
        )}
      </Box>
      <Box className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-table-header text-text-muted">
            <tr>
              {selectedColumns.map((column) => (
                <th
                  className="px-4 py-3 font-semibold"
                  key={fallbackInCaseOfSymbol(column.key)}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-5 text-text-muted"
                  colSpan={selectedColumns.length}
                >
                  No records
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, idx) => (
                <tr
                  className="border-t border-border hover:bg-table-row-hover"
                  key={idx}
                >
                  {selectedColumns.map((column) => (
                    <td
                      className="numeric px-4 py-3"
                      key={fallbackInCaseOfSymbol(column.key)}
                    >
                      {column.render(record)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
      {shouldRenderPagination && (
        <Box className="border-t border-border px-4 py-3">
          <Pagination
            currentPage={clampedCurrentPage}
            onPageChange={setCurrentPage}
            pageCount={pageCount}
          />
        </Box>
      )}
    </section>
  );
};
