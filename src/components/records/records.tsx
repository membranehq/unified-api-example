"use client";

import { memo, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/string-utils";
import { getPluralForm } from "@/lib/pluralize-utils";
import appObjectConfig from "@/lib/app-object-config";
import { Record } from "@/components/records/record";
import { CreateRecordModal } from "../create-record-modal";
import { EditRecordModal } from "../edit-record-modal";
import { IRecord } from "@/components/records/types";
import { RecordType } from "@/lib/schemas";
import { RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

// Empty State Component
const EmptyRecordsState = ({
  recordType,
  onRefetch,
  onCreateRecord
}: {
  recordType: RecordType;
  onRefetch?: () => Promise<void>;
  onCreateRecord: (recordData: Record<string, unknown>) => Promise<void>;
}) => {
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = useCallback(async () => {
    if (!onRefetch) return;

    setIsRefetching(true);
    try {
      await onRefetch();
    } finally {
      setIsRefetching(false);
    }
  }, [onRefetch]);

  const config = appObjectConfig[recordType as keyof typeof appObjectConfig];
  const IconComponent = config?.icon;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
          No {capitalize(getPluralForm(recordType))} Found
        </h3>
        <p className="text-sm text-gray-600 mb-6 tracking-tight">
          There are no {getPluralForm(recordType)} available in this integration.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onRefetch && (
            <Button
              variant="outline"
              onClick={handleRefetch}
              disabled={isRefetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
          {config?.allowCreate && (
            <CreateRecordModal
              recordType={recordType}
              onCreatedRecord={onCreateRecord}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Props interface for the Records component
 *
 * @interface RecordsProps
 * @description Defines the properties required for rendering and managing a list of records
 * with pagination, loading states, and CRUD operations
 */
interface RecordsProps {
  /** Array of record objects to be displayed in the list */
  records: IRecord[];

  /** The type of records being displayed (e.g., 'user', 'email', 'file') */
  recordType: RecordType;

  /** Flag indicating if the records are currently being loaded */
  isLoading: boolean;

  /**
   * Callback function to handle record deletion
   * @param recordId - The unique identifier of the record to delete
   * @returns Promise that resolves when deletion is complete
   */
  onDeleteRecord: (recordId: string) => Promise<void>;

  /**
   * Callback function to handle record creation
   * @param recordData - Object containing the data for the new record
   * @returns Promise that resolves when creation is complete
   */
  onCreateRecord: (recordData: Record<string, unknown>) => Promise<void>;

  /**
   * Callback function to handle record updates
   * @param recordId - The unique identifier of the record to update
   * @param recordData - Object containing the updated data for the record
   * @returns Promise that resolves when update is complete
   */
  onUpdateRecord: (
    recordId: string,
    recordData: Record<string, unknown>
  ) => Promise<void>;

  /** Optional function to render custom content on the right side of each record */
  renderRight?: (record: IRecord) => React.ReactNode;

  /** Optional function to render custom content in the header area */
  renderHeader?: () => React.ReactNode;

  /** Optional callback function to handle refetching records */
  onRefetch?: () => Promise<void>;
}

export const Records = memo(function Records({
  records,
  recordType,
  isLoading,
  onDeleteRecord,
  onCreateRecord,
  onUpdateRecord,
  renderRight,
  renderHeader,
  onRefetch,
}: RecordsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IRecord | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const handleEditRecord = useCallback((record: IRecord) => {
    setEditingRecord(record);
    setEditDialogOpen(true);
  }, []);

  const handleRefetch = useCallback(async () => {
    if (!onRefetch) return;

    setIsRefetching(true);
    try {
      await onRefetch();
    } finally {
      setIsRefetching(false);
    }
  }, [onRefetch]);

  const config =
    appObjectConfig[recordType as keyof typeof appObjectConfig];
  const IconComponent = config?.icon;

  return (
    <>
      {records.length === 0 && !isLoading ? (
        // Show only empty state when no records and not loading
        <EmptyRecordsState recordType={recordType} onRefetch={onRefetch} onCreateRecord={onCreateRecord} />
      ) : (
        // Show full records interface when there are records or loading
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-xl font-semibold text-gray-700 tracking-tight flex items-center gap-2">
              {/* icon */}
              <IconComponent className="w-5 h-5 text-gray-500" />
              {capitalize(getPluralForm(recordType))}
              {onRefetch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefetch}
                  disabled={isRefetching || isLoading}
                  className="ml-2 p-1 h-6 w-6"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </h2>
            {appObjectConfig[recordType as keyof typeof appObjectConfig]
              ?.allowCreate && (
                <CreateRecordModal
                  recordType={recordType}
                  onCreatedRecord={onCreateRecord}
                />
              )}
          </div>
          <div className="border rounded-lg overflow-hidden">
            {renderHeader && (
              <div className="bg-gray-50 p-3 text-sm text-gray-700 pl-4 sm:pl-6 border-b">
                {renderHeader()}
              </div>
            )}
            <div>
              {isLoading
                ? // Show skeleton records when loading
                Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="border-b last:border-b-0">
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                : // Show actual records when not loading
                records.map((record, idx: number) => (
                  <Record
                    key={record.id}
                    record={record}
                    index={idx}
                    onRecordDeleted={onDeleteRecord}
                    onEditRecord={handleEditRecord}
                    recordType={recordType}
                    renderRight={renderRight ? renderRight(record) : null}
                  />
                ))
              }
            </div>
          </div>
        </div>
      )}

      {editingRecord && (
        <EditRecordModal
          recordType={recordType}
          record={editingRecord}
          onUpdateRecord={onUpdateRecord}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
});
