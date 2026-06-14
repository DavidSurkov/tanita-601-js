import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Box } from "../wrappers/Box";
import { Heading } from "../wrappers/Heading";
import { CheckboxDropdown } from "./CheckboxDropdown";
import { Pagination } from "./Pagination";
import { fallbackInCaseOfSymbol } from "../../helpers/uuid";

const DEFAULT_RECORDS_PER_PAGE = 10;

type RecordKey<T extends Record<string, unknown>> = keyof T;

export type Column<T extends Record<string, unknown>> = {
  key: RecordKey<T> | (string & {});
  label: string;
  render(record: T): ReactNode;
  sortValue?(record: T): SortValue;
};

type SortOrder = "ASC" | "DESC";
type SortValue = string | number | boolean | Date | null | undefined;

const SORT_ARROW_PATHS: Record<SortOrder, string> = {
  ASC: "M6 3 3 7.5h6L6 3Z",
  DESC: "M6 9 9 4.5H3L6 9Z",
};

const getAriaSort = (sortOrder: SortOrder | null) => {
  if (sortOrder === "ASC") {
    return "ascending";
  }

  if (sortOrder === "DESC") {
    return "descending";
  }

  return "none";
};

type ComparableValue = string | number | boolean | Date | null;

const getComparableValue = (value: SortValue): ComparableValue => {
  if (
    value instanceof Date ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return null;
};

const compareValues = <T extends ComparableValue>(
  firstValue: T,
  secondValue: T,
) => {
  if (firstValue === null && secondValue === null) {
    return 0;
  }

  if (firstValue === null) {
    return 1;
  }

  if (secondValue === null) {
    return -1;
  }

  const normalizedFirstValue =
    firstValue instanceof Date ? firstValue.getTime() : firstValue;
  const normalizedSecondValue =
    secondValue instanceof Date ? secondValue.getTime() : secondValue;

  if (
    typeof normalizedFirstValue === "number" &&
    typeof normalizedSecondValue === "number"
  ) {
    return normalizedFirstValue - normalizedSecondValue;
  }

  return String(normalizedFirstValue).localeCompare(
    String(normalizedSecondValue),
  );
};

const SortArrowIcon = ({
  direction,
  highlighted = false,
}: {
  direction: SortOrder;
  highlighted?: boolean;
}) => (
  <svg
    aria-hidden="true"
    className={`size-3 ${highlighted ? "text-primary" : "text-text-soft"}`}
    fill="none"
    focusable="false"
    viewBox="0 0 12 12"
  >
    <path d={SORT_ARROW_PATHS[direction]} fill="currentColor" />
  </svg>
);

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
  const [sortState, setSortState] = useState<{
    order: SortOrder;
    columnKey: C["key"];
  } | null>(null);
  const onSort = (column: C) => {
    if (!column.sortValue) {
      return;
    }

    setSortState((prevState) => {
      if (!prevState || prevState.columnKey !== column.key) {
        return { columnKey: column.key, order: "ASC" };
      }

      return {
        columnKey: column.key,
        order: prevState.order === "ASC" ? "DESC" : "ASC",
      };
    });
  };

  const sortedRecords = useMemo(() => {
    if (sortState === null) {
      return records;
    }

    const sortColumn = columns.find(
      (column) => column.key === sortState.columnKey,
    );

    if (!sortColumn?.sortValue) {
      return records;
    }

    const getSortValue = sortColumn.sortValue;
    const directionMultiplier = sortState.order === "ASC" ? 1 : -1;

    return [...records].sort(
      (firstRecord, secondRecord) =>
        compareValues(
          getComparableValue(getSortValue(firstRecord)),
          getComparableValue(getSortValue(secondRecord)),
        ) * directionMultiplier,
    );
  }, [columns, records, sortState]);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedRecords.length / recordsPerPage),
  );
  const clampedCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (clampedCurrentPage - 1) * recordsPerPage;
  const paginatedRecords = sortedRecords.slice(
    pageStartIndex,
    pageStartIndex + recordsPerPage,
  );
  const selectedColumns = useMemo(
    () => columns.filter((column) => selectedColumnKeys.includes(column.key)),
    [columns, selectedColumnKeys],
  );

  const shouldRenderPagination = sortedRecords.length > recordsPerPage;

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
              {selectedColumns.map((column) => {
                const canSort = !!column.sortValue;
                const isSortedColumn =
                  canSort &&
                  sortState !== null &&
                  sortState.columnKey === column.key;
                const sortOrder = isSortedColumn ? sortState.order : null;

                return (
                  <th
                    aria-sort={canSort ? getAriaSort(sortOrder) : undefined}
                    className="px-4 py-3 font-semibold"
                    key={fallbackInCaseOfSymbol(column.key)}
                  >
                    {canSort ? (
                      <button
                        className="inline-flex cursor-pointer items-center gap-1 text-left font-semibold text-text-muted transition hover:text-text"
                        onClick={() => onSort(column)}
                        type="button"
                      >
                        <span className="pt-0.5">{column.label}</span>
                        <Box>
                          <SortArrowIcon
                            direction="ASC"
                            highlighted={sortOrder === "ASC"}
                          />
                          <SortArrowIcon
                            direction="DESC"
                            highlighted={sortOrder === "DESC"}
                          />
                        </Box>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length === 0 ? (
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
