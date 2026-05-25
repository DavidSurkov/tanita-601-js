import { Box } from "../wrappers/Box";
import { Button } from "./Button";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange(page: number): void;
};

export function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  const canGoBackward = currentPage > 1;
  const canGoForward = currentPage < pageCount;

  return (
    <Box className="flex flex-wrap items-center gap-2 justify-center">
      <Button
        aria-label="Go to first page"
        className="min-w-20"
        disabled={!canGoBackward}
        onClick={() => {
          onPageChange(1);
        }}
        variant="secondary"
      >
        {"<<"}
      </Button>
      <Button
        aria-label="Go to previous page"
        className="min-w-20"
        disabled={!canGoBackward}
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        variant="secondary"
      >
        {"<"}
      </Button>

      <Box className="numeric text-sm font-semibold text-text-muted p-2">
        Page{" "}
        <span className="inline-flex items-center justify-center text-primary">
          {currentPage}
        </span>{" "}
        of {pageCount}
      </Box>

      <Button
        aria-label="Go to next page"
        className="min-w-20"
        disabled={!canGoForward}
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        variant="secondary"
      >
        {">"}
      </Button>
      <Button
        aria-label="Go to last page"
        className="min-w-20"
        disabled={!canGoForward}
        onClick={() => {
          onPageChange(pageCount);
        }}
        variant="secondary"
      >
        {">>"}
      </Button>
    </Box>
  );
}
