"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lastLoading, setlastLoading] = useState(false);
  const [NextLoading, setnextLoading] = useState(false);

  useEffect(() => {
    setlastLoading(false);
    setnextLoading(false);
  }, [currentPage]);

  const LastPage = async (newPage: number) => {
    setlastLoading(true);
    const params = new URLSearchParams(searchParams as any);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  const NextPage = async (newPage: number) => {
    setnextLoading(true);
    const params = new URLSearchParams(searchParams as any);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center items-center">
        <button
          type="button"
          className="px-4 py-2 w-20 h-10 bg-neutral-700 rounded-md hover:bg-neutral-600"
          onClick={() => LastPage(currentPage - 1)}
          disabled={currentPage === 1 || lastLoading}
        >
          {lastLoading ? (
            <div className="w-fit m-auto animate-spin">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            "Last"
          )}
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="px-4 py-2 w-20 h-10 bg-neutral-700 rounded-md hover:bg-neutral-600"
          onClick={() => NextPage(currentPage + 1)}
          disabled={currentPage === totalPages || NextLoading}
        >
          {NextLoading ? (
            <div className="w-fit m-auto animate-spin">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
