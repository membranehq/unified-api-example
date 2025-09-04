"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "./contexts/auth-context";
import { useUserTracking } from "@/lib/posthog";
import {
  Database,
  Zap,
} from "lucide-react";
import { useIntegration } from "@membranehq/react";
import appObjects from "@/lib/app-objects";
import { SelectionGroup } from "../components/selection-group";
import { useIntegrationConnection } from "../hooks/use-integration-connection";
import { useDataSourceAppliedIntegrations } from "../hooks/use-applied-integrations";
import { ManageIntegrationsModal } from "../components/manage-integrations-modal/manage-integrations-modal";
import {
  ConnectionLoadingView,
  ConnectionRequiredView,
  RecordsView,
  EmptyStateView,
} from "../components/views";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { trackUserAction, trackIntegrationUsage } = useUserTracking();

  const [selectedIntegrationKey, setSelectedIntegrationKey] = useState<
    string | null
  >(searchParams.get("integration") || null);

  const [selectedAppObjectKey, setSelectedAppObjectKey] = useState<
    string | null
  >(searchParams.get("appObject") || null);

  const [objectsViewMode, setObjectsViewMode] = useState<"all" | "categories">(
    "categories"
  );

  // Update URL when selections change
  const updateURL = (integration: string | null, appObject: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (integration) {
      params.set("integration", integration);
    } else {
      params.delete("integration");
    }

    if (appObject) {
      params.set("appObject", appObject);
    } else {
      params.delete("appObject");
    }

    router.replace(`?${params.toString()}`);
  };

  // Update URL when selectedIntegrationKey changes
  useEffect(() => {
    updateURL(selectedIntegrationKey, selectedAppObjectKey);
  }, [selectedIntegrationKey, selectedAppObjectKey]);

  // Track app object selection
  const handleAppObjectSelection = (key: string | null) => {
    if (user?.email) {
      trackUserAction("app_object_selected", user.email, {
        app_object_key: key,
        previous_app_object: selectedAppObjectKey,
      });
    }

    // Clear integration when app object changes to prevent impossible combinations
    if (selectedAppObjectKey !== key) {
      setSelectedIntegrationKey(null);
    }
    setSelectedAppObjectKey(key);
  };

  // Track integration selection
  const handleIntegrationSelection = (key: string | null) => {
    if (user?.email && key && selectedAppObjectKey) {
      trackIntegrationUsage(key, selectedAppObjectKey, user.email, {
        integration_key: key,
        app_object_key: selectedAppObjectKey,
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

  // fetch all integrations that are applied to the selected data source
  const {
    integrations: appliedToIntegrations,
    loading: appliedIntegrationsIsLoading,
  } = useDataSourceAppliedIntegrations(selectedAppObjectKey);

  // Get connection to the selected integration
  const {
    data: connection,
    isLoading: connectionLoading,
    isConnecting,
    connect,
  } = useIntegrationConnection({
    integrationKey: selectedIntegrationKey ?? null,
  });

  const appObjectsItems = Object.keys(appObjects).map((key) => ({
    id: key,
    key: key,
    name: appObjects[key as keyof typeof appObjects].label,
    icon: appObjects[key as keyof typeof appObjects].icon,
    category: appObjects[key as keyof typeof appObjects].category,
  }));

  // filter out integrations that are not ready (credentials not set)
  const integrationItems = appliedToIntegrations
    .filter((integration) => integration.state === "READY")
    .map((integration) => ({
      id: integration.id,
      key: integration.key!,
      name: integration.name,
      logoUri: integration.logoUri,
    }));

  // Render the appropriate screen based on current state
  const renderMainContent = () => {
    if (!selectedAppObjectKey || !selectedIntegrationKey) {
      return (
        <EmptyStateView
          selectedAppObjectKey={selectedAppObjectKey}
          selectedIntegrationKey={selectedIntegrationKey}
        />
      );
    }

    if (connectionLoading) {
      return <ConnectionLoadingView />;
    }

    // Connection may be disconnected if authentication was revoked, didn't go though or we couldn't refresh the token
    const isDisconnected = connection?.disconnected;
    const title = isDisconnected
    ? `Reconnect ${integrationName}`
    : `Connect${integrationName ? ` to ${integrationName}` : ""}`;

    if (!connection || isDisconnected) {
      return (
        <ConnectionRequiredView
          integrationName={integrationName}
          integrationLogoUri={integrationLogoUri}
          connect={connect}
          isConnecting={isConnecting}
          userEmail={user?.email}
          buttonText={isDisconnected ? "Reconnect" : "Connect"}
          title={title}
          description={isDisconnected ? `Your connection to ${integrationName} has been disconnected. Please reconnect to view records.` : undefined}
        />
      );
    }

    return (
      <RecordsView
        integrationKey={selectedIntegrationKey}
        appObjectKey={selectedAppObjectKey}
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
              {/* Step 1: App Object Selection with Categories */}
              <SelectionGroup
                title="Object"
                description="Choose the type of object you want to view records for (e.g., contacts, companies, orders)"
                items={appObjectsItems}
                selectedKey={selectedAppObjectKey}
                onSelect={handleAppObjectSelection}
                visibleCount={5}
                titleIcon={Database}
                viewMode={objectsViewMode}
                onViewModeChange={setObjectsViewMode}
              />

              {/* Step 2: Applied Integrations*/}
              <SelectionGroup
                title="Integration"
                description="Select the third-party service you want to fetch records from"
                items={integrationItems}
                selectedKey={selectedIntegrationKey ?? null}
                onSelect={handleIntegrationSelection}
                loading={appliedIntegrationsIsLoading}
                visibleCount={4}
                titleIcon={Zap}
                showEmptyMessage={!selectedAppObjectKey}
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
