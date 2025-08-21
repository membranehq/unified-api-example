import { Mail } from "lucide-react";
import { RecordTypeWrapper } from "./record-type-wrapper";
import { emailSchema } from "@/lib/app-object-config";
import { z } from "zod";
import { IRecord } from "../records/types";

interface EmailRecordProps {
  record: IRecord;
}

// Derive the type from the Zod schema
type EmailData = z.infer<typeof emailSchema>;

export function EmailRecord({ record }: EmailRecordProps) {
  const emailData = record.data as Partial<EmailData>;

  const emailSubject = typeof emailData?.subject === 'string' ? emailData.subject : null;

  return (
    <RecordTypeWrapper>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="truncate block text-xs sm:text-sm">
            {emailSubject || record.name || "No Subject"}
          </span>
        </div>
      </div>
    </RecordTypeWrapper>
  );
}
