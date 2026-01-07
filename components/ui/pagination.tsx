import { useMemo } from "react";
import { useInstructorsStore } from "@/module/instructor/store/instructors-store";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  total: number;
  pages: number;
  currentPage: number;
}

export default function Pagination({
  total,
  pages,
  currentPage,
}: PaginationProps) {
  const { setPage } = useInstructorsStore();

  const handlePaginationNumber = (page: number) => {
    if (page < 1) return;
    if (page > pages) return;
    setPage(page);
  };

  // ✅ Memoized pages array
  const pageNumbers = useMemo(() => {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }, [pages]);

  return (
    <div
      className="
        w-full h-16 px-6
        font-[Helvetica] text-sm text-zinc-200
        bg-linear-to-br from-emerald-950/70 via-[#002a1e]/80 to-black/80
        backdrop-blur-xl
        border border-emerald-900/40
        rounded-xl
        flex items-center justify-between
      "
    >
      {/* Left info */}
      <div className="flex items-center gap-6 text-zinc-300">
        <p>
          Page:{" "}
          <span className="text-emerald-400 font-medium">
            {currentPage} / {pages}
          </span>
        </p>
        <p>
          Total:{" "}
          <span className="text-emerald-400 font-medium">{total}</span>
        </p>
      </div>

      {/* Pagination buttons */}
      <div className="h-full flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => handlePaginationNumber(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            h-9 w-9
            flex items-center justify-center
            rounded-md
            bg-emerald-900/70
            hover:bg-emerald-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <ChevronsLeft className="w-4 h-4 text-emerald-300" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePaginationNumber(page)}
              className={`
                h-9 min-w-9 px-3
                flex items-center justify-center
                rounded-md
                font-medium
                transition
                ${
                  isActive
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30"
                    : "bg-emerald-900/60 text-zinc-300 hover:bg-emerald-800 hover:text-white"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => handlePaginationNumber(currentPage + 1)}
          disabled={currentPage === pages}
          className="
            h-9 w-9
            flex items-center justify-center
            rounded-md
            bg-emerald-900/70
            hover:bg-emerald-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <ChevronsRight className="w-4 h-4 text-emerald-300" />
        </button>
      </div>
    </div>
  );
}
