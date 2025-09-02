"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, AlertTriangle, RefreshCw } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const ErrorView = ({
  error,
  onRetry,
  isLoading = false,
}: {
  error: Error | null;
  onRetry: () => void;
  isLoading?: boolean;
}) => {
  const [showFullError, setShowFullError] = useState(false);

  const toggleErrorDetails = () => {
    setShowFullError(!showFullError);
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <div className="p-4 sm:p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">Error Loading Records</h3>

          <div className="mb-4">
            <button
              onClick={toggleErrorDetails}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors cursor-pointer border border-red-200 ${jetbrainsMono.className}`}
              title="Click to view full error details"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              {error?.message || "Failed to load records from the integration."}
              <span className="ml-1 text-xs">▼</span>
            </button>
          </div>

          {showFullError && error && (
            <div className="mb-4 text-left">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-gray-700">Error Message:</strong>
                    <pre className={`mt-1 p-3 bg-gray-50 rounded text-red-600 overflow-x-auto text-xs border ${jetbrainsMono.className}`}>
                      {error.message}
                    </pre>
                  </div>
                  {error.stack && (
                    <div>
                      <strong className="text-gray-700">Stack Trace:</strong>
                      <pre className={`mt-1 p-3 bg-gray-50 rounded text-gray-700 overflow-x-auto text-xs border max-h-40 overflow-y-auto ${jetbrainsMono.className}`}>
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {error.name && (
                    <div>
                      <strong className="text-gray-700">Error Type:</strong>
                      <span className="ml-1 text-gray-600">{error.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button onClick={onRetry} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;


