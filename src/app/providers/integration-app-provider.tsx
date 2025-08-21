"use client"

import { IntegrationAppProvider as Provider } from "@integration-app/react";
import { fetchWithAuth } from "@/lib/fetch-utils";

export function IntegrationAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const fetchToken = async () => {
    const data = await fetchWithAuth("/api/integration-token");
    return data.token;
  };

  return (
    <Provider
      fetchToken={fetchToken}>
      {children}
    </Provider>
  );
}
