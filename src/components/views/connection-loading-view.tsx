"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const ConnectionLoadingView = () => (
  <div className="bg-gray-50 rounded-lg border border-gray-200">
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-40 mx-auto rounded-md" />
      </div>
    </div>
  </div>
);

export default ConnectionLoadingView;


