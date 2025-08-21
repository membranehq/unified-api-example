import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationData {
  page?: number;
  limit?: number;
  totalRecords?: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startRecord?: number;
  endRecord?: number;
}

interface PaginationControlsProps {
  /** Optional pagination data for controlling record display and navigation */
  pagination?: PaginationData;

  /** Flag indicating if the component is currently navigating between pages */
  isNavigating: boolean;

  /** Callback function to navigate to the previous page of records */
  onPreviousPage: () => void;

  /** Callback function to navigate to the next page of records */
  onNextPage: () => void;

  /** Optional custom className for the container */
  className?: string;
}

export const PaginationControls = React.memo(function PaginationControls({
  pagination,
  isNavigating,
  onPreviousPage,
  onNextPage,
  className = "",
}: PaginationControlsProps) {

  return (
    <div className={`flex items-center justify-end ${className}`}>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination?.hasPreviousPage || isNavigating}
          onClick={onPreviousPage}
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          {isNavigating ? (
            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination?.hasNextPage || isNavigating}
          onClick={onNextPage}
          className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          {isNavigating ? (
            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </Button>
      </div>
    </div>
  );
});
