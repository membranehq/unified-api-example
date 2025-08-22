import { z } from "zod";
import { RecordType } from "@/lib/schemas";
import {
  Mail,
  User, Briefcase,
  Users,
  Building2,
  Building
} from "lucide-react";
import {
  UserRecord, OrderRecord,
  JobApplicationRecord,
  ContactRecord,
  JobRecord,
  CompanyRecord
} from "@/components/object-types";
import { IRecord } from "@/components/records/types";
import {
  ordersSchema,
  usersSchema,
  jobapplicationsSchema,
  contactsSchema,
  jobsSchema,
  companiesSchema,
} from "./schemas";

const appObjectConfig: Record<
  RecordType,
  {
    schema: z.ZodObject<z.ZodRawShape>;
    allowDelete: boolean;
    allowUpdate: boolean;
    allowCreate: boolean;
    icon: React.ComponentType<{ className?: string }>;
    component?: React.ComponentType<{ record: IRecord }>;
  }
> = {
  orders: {
    schema: ordersSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Mail,
    component: OrderRecord,
  },
  users: {
    schema: usersSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: User,
    component: UserRecord,
  },
  "job-applications": {
    schema: jobapplicationsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Briefcase,
    component: JobApplicationRecord,
  },
  contacts: {
    schema: contactsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Users,
    component: ContactRecord,
  },
  jobs: {
    schema: jobsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Building2,
    component: JobRecord,
  },
  companies: {
    schema: companiesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Building,
    component: CompanyRecord,
  },
};

export default appObjectConfig;
