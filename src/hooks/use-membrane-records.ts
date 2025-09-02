import { useCallback } from "react";
import { useIntegrationApp } from "@membranehq/react";
import useSWR from "swr";

import { getElementKey } from "@/lib/element-key";
import { IRecord } from "../components/records/types";
import { getSingularForm } from "@/lib/pluralize-utils";

interface UseMembraneRecordsParams {
  integrationKey: string | null | undefined;
  dataSourceKey: string | null | undefined;
  cursor?: string | null | undefined;
  hasConnection: boolean;
}

export function useMembraneRecords({
  integrationKey,
  dataSourceKey,
  cursor,
  hasConnection,
}: UseMembraneRecordsParams) {
  const membraneClient = useIntegrationApp();

  // SWR key for caching - null when conditions aren't met to prevent fetching
  const swrKey =
    integrationKey && dataSourceKey && hasConnection
      ? `records-${integrationKey}-${dataSourceKey}-${cursor || "initial"}`
      : null;

  const actionKey = getElementKey(
    getSingularForm(dataSourceKey!),
    "list-action"
  );

  // Fetcher function for SWR
  const fetchRecords = useCallback(async () => {
    const result = await membraneClient
      .connection(integrationKey!)
      .action(actionKey)
      .run({ cursor });

    return result;
  }, [membraneClient, integrationKey, dataSourceKey, cursor]);

  // Fetch records using SWR
  const {
    data: recordsData,
    error: recordsError,
    isLoading: recordsLoading,
    mutate: mutateRecords,
  } = useSWR(swrKey, fetchRecords, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const records: IRecord[] = recordsData?.output?.records || [];

  const handleDeleteRecord = useCallback(
    async (recordId: string) => {
      if (!integrationKey || !dataSourceKey) return;

      const actionKey = getElementKey(
        getSingularForm(dataSourceKey),
        "delete-action"
      );

      await membraneClient
        .connection(integrationKey)
        .action(actionKey)
        .run({ id: recordId });

      // Update local state after successful action
      const updatedData = {
        ...recordsData,
        output: {
          ...recordsData?.output,
          records:
            recordsData?.output?.records.filter(
              (record: Record<string, unknown>) => record.id !== recordId
            ) || [],
        },
      };
      mutateRecords(updatedData, false);

      // Refetch to ensure data consistency
      mutateRecords();
    },
    [membraneClient, integrationKey, dataSourceKey, mutateRecords, recordsData]
  );

  const handleCreateRecord = useCallback(
    async (recordData: Record<string, unknown>) => {
      if (!integrationKey || !dataSourceKey) return;

      const actionKey = getElementKey(
        getSingularForm(dataSourceKey),
        "create-action"
      );

      const result = await membraneClient
        .connection(integrationKey)
        .action(actionKey)
        .run({
          fields: recordData,
        });

      // Update local state after successful action
      const newRecord = {
        id: result.output?.id || `new-${Date.now()}`,
        fields: recordData,
        ...recordData,
      };

      const updatedData = {
        ...recordsData,
        output: {
          ...recordsData?.output,
          records: [newRecord, ...(recordsData?.output?.records || [])],
        },
      };
      mutateRecords(updatedData, false);

      // Refetch to ensure data consistency
      mutateRecords();
    },
    [membraneClient, integrationKey, dataSourceKey, mutateRecords, recordsData]
  );

  const handleUpdateRecord = useCallback(
    async (recordId: string, recordData: Record<string, unknown>) => {
      if (!integrationKey || !dataSourceKey) return;

      const actionKey = getElementKey(
        getSingularForm(dataSourceKey),
        "update-action"
      );

      await membraneClient.connection(integrationKey).action(actionKey).run({
        id: recordId,
        fields: recordData,
      });

      // Update local state after successful action
      const updatedData = {
        ...recordsData,
        output: {
          ...recordsData?.output,
          records:
            recordsData?.output?.records.map(
              (record: Record<string, unknown>) =>
                record.id === recordId
                  ? {
                      ...record,
                      fields: {
                        ...(record.fields as Record<string, unknown>),
                        ...recordData,
                      },
                      ...recordData,
                    }
                  : record
            ) || [],
        },
      };
      mutateRecords(updatedData, false);

      // Refetch to ensure data consistency
      mutateRecords();
    },
    [membraneClient, integrationKey, dataSourceKey, mutateRecords, recordsData]
  );

  const code = `import { useIntegrationApp } from "@membranehq/react";

const membraneClient = useIntegrationApp();

const result = await membraneClient
  .connection("${integrationKey}")
  .action("${actionKey}")
  .run({ cursor: ${cursor ? `"${cursor}"` : "undefined"} });`;

  return {
    records,
    recordsData,
    recordsError,
    recordsLoading,
    handleDeleteRecord,
    handleCreateRecord,
    handleUpdateRecord,
    mutateRecords,
    code,
  };
}
