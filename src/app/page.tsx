"use client";

import React, { useState, useEffect } from "react";
import { DataSource } from "@integration-app/sdk";
import { Button } from "@/components/ui/button";
import { RecordType } from "@/lib/schemas";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "./contexts/auth-context";
import { useUserTracking } from "@/lib/posthog";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Database, Zap, RefreshCw, AlertTriangle, Link, Plug, Plug2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useDataSources, useIntegration } from "@integration-app/react";
import { JetBrains_Mono } from "next/font/google";
import appObjectConfig from "@/lib/app-object-config";
import { SelectionGroup } from "../components/selection-group";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });
import { useMembraneRecords } from "../hooks/use-membrane-records";
import { useIntegrationConnection } from "../hooks/use-integration-connection";
import { useDataSourceAppliedIntegrations } from "../hooks/use-applied-integrations";
import { PaginationControls } from "../components/records/pagination-controls";
import { Records } from "../components/records/records";
import { ManageIntegrationsModal } from "../components/manage-integrations-modal/manage-integrations-modal";

// Connection Loading Screen Component
const ConnectionLoadingScreen = () => (
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

// Connection Required Screen Component
const ConnectionRequiredScreen = ({
  integrationName,
  integrationLogoUri,
  connect,
  isConnecting,
  userEmail,
}: {
  integrationName: string | null;
  integrationLogoUri: string | null;
  connect: () => void;
  isConnecting: boolean;
  userEmail?: string;
}) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200">
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <div className="relative flex items-center justify-center mb-4">
          {/* User Avatar Circle (Left) */}
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <Avatar email={userEmail} size="lg" className="w-full h-full" />
          </div>

          {/* App Logo Circle (Right) */}
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm overflow-hidden ml-4">
            {integrationLogoUri ? (
              <Image
                src={integrationLogoUri}
                alt=""
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            )}
          </div>

          {/* Connection Icon - Positioned on top */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
            <Plug2 className="w-5 h-5 text-gray-600 rotate-90" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
          Connect to {integrationName}
        </h3>
        <p className="text-gray-600 mb-4 text-sm tracking-tight">
          Connect to {integrationName} to view records.
        </p>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isConnecting ? (
            "Connecting..."
          ) : "Connect"}
        </Button>
      </div>
    </div>
  </div>
);

// Error Screen Component
const ErrorScreen = ({
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
          <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
            Error Loading Records
          </h3>

          {/* Error Badge */}
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

          {/* Full Error Details */}
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

// Records Screen Component
const RecordsScreen = ({
  integrationKey,
  dataSourceKey,
  hasConnection,
}: {
  integrationKey: string | null;
  dataSourceKey: string | null;
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
  } = useMembraneRecords({
    integrationKey,
    dataSourceKey,
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

  // Reset pagination when selection changes
  React.useEffect(() => {
    setCursor(null);
    setCursorHistory([]);
  }, [integrationKey, dataSourceKey]);

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

  const cleanedRecords = records.map((record) => ({
    id: record.id,
    data: record.data,
  }));

  if (recordsError) {
    return <ErrorScreen error={recordsError} onRetry={handleRetry} isLoading={isRetrying || recordsLoading} />;
  }

  return (
    <Records
      records={cleanedRecords}
      recordType={dataSourceKey as RecordType}
      isLoading={recordsLoading}
      onDeleteRecord={async (id: string) => handleDeleteRecord(id)}
      onCreateRecord={async (data: Record<string, unknown>) =>
        handleCreateRecord(data)
      }
      onUpdateRecord={async (id: string, data: Record<string, unknown>) =>
        handleUpdateRecord(id, data)
      }
      onRefetch={handleRefetch}
      renderHeader={() => (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          {!recordsLoading ? (
            <div className="text-sm">
              Showing {cleanedRecords.length} records
            </div>
          ) : (
            <div></div>
          )}
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

// Empty State Screen Component
const EmptyStateScreen = ({
  selectedDataSourceKey,
  selectedIntegrationKey,
}: {
  selectedDataSourceKey: string | null;
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
        {!selectedDataSourceKey || !selectedIntegrationKey && (
          <p className="text-sm text-gray-600 mb-4 tracking-tight">
            Choose a Object and Integration to view records.
          </p>
        )}
      </div>
    </div>
  </div>
);

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { trackUserAction, trackIntegrationUsage } = useUserTracking();

  const [selectedIntegrationKey, setSelectedIntegrationKey] = useState<
    string | null
  >(searchParams.get("integration") || null);

  const [selectedDataSourceKey, setSelectedDataSourceKey] = useState<
    string | null
  >(searchParams.get("dataSource") || null);

  // Update URL when selections change
  const updateURL = (integration: string | null, dataSource: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (integration) {
      params.set("integration", integration);
    } else {
      params.delete("integration");
    }

    if (dataSource) {
      params.set("dataSource", dataSource);
    } else {
      params.delete("dataSource");
    }

    router.replace(`?${params.toString()}`);
  };

  // Update URL when selectedIntegrationKey changes
  useEffect(() => {
    updateURL(selectedIntegrationKey, selectedDataSourceKey);
  }, [selectedIntegrationKey, selectedDataSourceKey]);

  // Track data source selection
  const handleDataSourceSelection = (key: string | null) => {
    if (user?.email) {
      trackUserAction("data_source_selected", user.email, {
        data_source: key,
        previous_data_source: selectedDataSourceKey,
      });
    }

    // Clear integration when data source changes to prevent impossible combinations
    if (selectedDataSourceKey !== key) {
      setSelectedIntegrationKey(null);
    }
    setSelectedDataSourceKey(key);
  };

  // Track integration selection
  const handleIntegrationSelection = (key: string | null) => {
    if (user?.email && key && selectedDataSourceKey) {
      trackIntegrationUsage(key, selectedDataSourceKey, user.email, {
        integration_key: key,
        data_source_key: selectedDataSourceKey,
      });
    }

    const integration = integrationItems.find((item) => item.key === key);
    setSelectedIntegrationKey(integration?.key ?? null);
  };

  // Fetch more info about the selected integration
  const {
    integration: { name: integrationName, logoUri: integrationLogoUri } = {
      key: null,
      name: null,
      logoUri: null,
      connection: null,
    },
  } = useIntegration(selectedIntegrationKey!);

  // Fetch all data sources
  const { items: dataSources, loading: dataSourcesLoading } = useDataSources();

  // fetch all integrations that are applied to the selected data source
  const {
    integrations: appliedToIntegrations,
    loading: appliedIntegrationsIsLoading,
  } = useDataSourceAppliedIntegrations(selectedDataSourceKey);

  // Get connection to the selected integration
  const {
    data: connection,
    isLoading: connectionLoading,
    isConnecting,
    connect,
  } = useIntegrationConnection({
    integrationKey: selectedIntegrationKey ?? null,
  });

  const dataSourceItems = dataSources.map((dataSource: DataSource) => ({
    id: dataSource.id,
    key: dataSource.key,
    name: dataSource.name,
    icon: appObjectConfig[dataSource.key as keyof typeof appObjectConfig]?.icon,
  }));

  const integrationItems = (appliedToIntegrations || []).map((integration) => ({
    id: integration.id,
    key: integration.key,
    name: integration.name,
    logoUri: integration.logoUri,
    disabled: integration.state !== "READY",
  }));

  // Render the appropriate screen based on current state
  const renderMainContent = () => {
    if (!selectedDataSourceKey || !selectedIntegrationKey) {
      return (
        <EmptyStateScreen
          selectedDataSourceKey={selectedDataSourceKey}
          selectedIntegrationKey={selectedIntegrationKey}
        />
      );
    }

    if (connectionLoading) {
      return <ConnectionLoadingScreen />;
    }

    if (!connection) {
      return (
        <ConnectionRequiredScreen
          integrationName={integrationName}
          integrationLogoUri={integrationLogoUri}
          connect={connect}
          isConnecting={isConnecting}
          userEmail={user?.email}
        />
      );
    }

    return (
      <RecordsScreen
        integrationKey={selectedIntegrationKey}
        dataSourceKey={selectedDataSourceKey}
        hasConnection={!!connection}
      />
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {/* Step 1: Data Source Selection*/}
              <SelectionGroup
                title="Object"
                items={dataSourceItems}
                selectedKey={selectedDataSourceKey}
                onSelect={handleDataSourceSelection}
                loading={dataSourcesLoading}
                visibleCount={3}
                titleIcon={Database}
              />

              {/* Step 2: Applied Integrations*/}
              <SelectionGroup
                title="Integration"
                items={integrationItems}
                selectedKey={selectedIntegrationKey ?? null}
                onSelect={handleIntegrationSelection}
                loading={appliedIntegrationsIsLoading}
                visibleCount={3}
                titleIcon={Zap}
                showEmptyMessage={!selectedDataSourceKey}
                emptyMessage="All available integrations will appear here after object selection"
              />
            </div>

            {/* Manage Integrations Modal */}
            <div className="ml-4 flex-shrink-0">
              <ManageIntegrationsModal />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:py-6">
        {renderMainContent()}
      </div>
    </div>
  );
}
