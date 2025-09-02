"use client";

import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyStateView = ({
  selectedAppObjectKey,
  selectedIntegrationKey,
}: {
  selectedAppObjectKey: string | null;
  selectedIntegrationKey: string | null;
}) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200">
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
          No Records to Display
        </h3>
        {!selectedAppObjectKey || (!selectedIntegrationKey && (
          <p className="text-sm text-gray-600 mb-4 tracking-tight">
            Choose a Object and Integration to view records.
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default EmptyStateView;


