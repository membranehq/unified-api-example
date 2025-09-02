"use client";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Plug2 } from "lucide-react";
import React from "react";

export const ConnectionRequiredView = ({
  integrationName,
  integrationLogoUri,
  connect,
  isConnecting,
  userEmail,
  buttonText = "Connect",
  title,
  description,
}: {
  integrationName: string | null;
  integrationLogoUri: string | null;
  connect: () => void;
  isConnecting: boolean;
  userEmail?: string;
  buttonText?: string;
  title?: string;
  description?: string;
}) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200">
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <Avatar email={userEmail} size="lg" className="w-full h-full" />
          </div>

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

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
            <Plug2 className="w-5 h-5 text-gray-600 rotate-90" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm tracking-tight">
          {description || `Connect to ${integrationName} to view records.`}
        </p>
        <Button onClick={connect} disabled={isConnecting} className="bg-primary text-white hover:bg-primary/90">
          {isConnecting ? "Connecting..." : buttonText}
        </Button>
      </div>
    </div>
  </div>
);

export default ConnectionRequiredView;


