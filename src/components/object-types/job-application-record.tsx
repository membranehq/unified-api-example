import { Briefcase } from "lucide-react";
import { RecordTypeWrapper } from "./record-type-wrapper";
import { jobapplicationsSchema } from "@/lib/schemas";
import { z } from "zod";
import { IRecord } from "../records/types";

interface JobApplicationRecordProps {
  record: IRecord;
}

// Derive the type from the Zod schema
type JobApplicationData = z.infer<typeof jobapplicationsSchema>;

export function JobApplicationRecord({ record }: JobApplicationRecordProps) {
  const jobAppData = record.data as Partial<JobApplicationData>;

  const candidateId = typeof jobAppData?.candidateId === 'string' ? jobAppData.candidateId : null;
  const jobId = typeof jobAppData?.jobId === 'string' ? jobAppData.jobId : null;
  const status = typeof jobAppData?.status === 'string' ? jobAppData.status : null;
  const currentStage = typeof jobAppData?.currentStage === 'string' ? jobAppData.currentStage : null;

  return (
    <RecordTypeWrapper>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-medium truncate text-xs sm:text-sm">
            {record.name || "Job Application"}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {status && (
              <span className="capitalize">{status}</span>
            )}
            {currentStage && (
              <span>• {currentStage}</span>
            )}
          </div>
        </div>
      </div>
    </RecordTypeWrapper>
  );
}
