"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppObjectKey } from "@/lib/app-objects-schemas";
import appObjects from "@/lib/app-objects";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icons } from "@/components/ui/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { JetBrains_Mono } from "next/font/google";
import { useMembraneRecords } from "@/hooks/use-membrane-records";
import { PaginationControls } from "@/components/records/pagination-controls";
import { Records } from "@/components/records/records";
import ErrorView from "./error-view";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const RecordsView = ({
  integrationKey,
  appObjectKey,
  hasConnection,
}: {
  integrationKey: string | null;
  appObjectKey: string | null;
  hasConnection: boolean;
}) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  const {
    records,
    recordsData,
    recordsError,
    recordsLoading,
    handleDeleteRecord,
    handleCreateRecord,
    handleUpdateRecord,
    mutateRecords,
    code,
  } = useMembraneRecords({
    integrationKey,
    dataSourceKey: appObjectKey,
    cursor,
    hasConnection,
  });

  const hasNextPage = !!recordsData?.output?.cursor;
  const hasPreviousPage = cursorHistory.length > 0;

  const pagination = {
    hasNextPage,
    hasPreviousPage,
  };

  const handlePreviousPage = () => {
    if (!hasPreviousPage) return;

    const previousCursor = cursorHistory[cursorHistory.length - 1];
    setCursorHistory((prev) => prev.slice(0, -1));
    setCursor(previousCursor || null);
  };

  const handleNextPage = () => {
    if (!hasNextPage) return;

    const nextCursor = recordsData?.output?.cursor;
    if (cursor) {
      setCursorHistory((prev) => [...prev, cursor]);
    }
    setCursor(nextCursor || null);
  };

  React.useEffect(() => {
    setCursor(null);
    setCursorHistory([]);
  }, [integrationKey, appObjectKey]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await mutateRecords();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRefetch = async () => {
    await mutateRecords();
  };

  if (recordsError) {
    return (
      <ErrorView error={recordsError} onRetry={handleRetry} isLoading={isRetrying || recordsLoading} />
    );
  }

  return (
    <Records
      records={records}
      appObjectKey={appObjectKey as AppObjectKey}
      appObjectLabel={appObjects[appObjectKey as keyof typeof appObjects].label}
      isLoading={recordsLoading}
      onDeleteRecord={async (id: string) => handleDeleteRecord(id)}
      onCreateRecord={async (data: Record<string, unknown>) => handleCreateRecord(data)}
      onUpdateRecord={async (id: string, data: Record<string, unknown>) => handleUpdateRecord(id, data)}
      onRefetch={handleRefetch}
      renderHeader={() => (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            {!recordsLoading ? (
              <div className="text-sm">Showing {records.length} records</div>
            ) : (
              <div></div>
            )}
            {code && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View API Code">
                    <Icons.code className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">API Code Example</h4>
                    <div className="rounded border overflow-hidden">
                      <SyntaxHighlighter
                        language="typescript"
                        style={oneLight}
                        customStyle={{
                          margin: 0,
                          fontSize: "14px",
                          fontFamily: jetbrainsMono.style.fontFamily,
                        }}
                        showLineNumbers={true}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <PaginationControls
            pagination={pagination}
            isNavigating={recordsLoading}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}
    />
  );
};

export default RecordsView;


