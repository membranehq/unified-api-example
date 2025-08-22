import { z } from "zod";
import { RecordType } from "@/lib/schemas";
import {
  Mail,
  User,
  Briefcase,
  Users,
  Building2,
  Building,
  FileText,
  Target,
  Package,
  TrendingUp,
  Receipt,
  Calendar,
  StickyNote,
} from "lucide-react";
import {
  UserRecord,
  OrderRecord,
  JobApplicationRecord,
  ContactRecord,
  JobRecord,
  CompanyRecord,
  JobCandidateRecord,
  TaskRecord,
  ProductRecord,
  LeadRecord,
  DealRecord,
  InvoiceRecord,
  ActivityRecord,
  NoteRecord,
} from "@/components/object-types";
import { IRecord } from "@/components/records/types";
import {
  ordersSchema,
  usersSchema,
  jobapplicationsSchema,
  contactsSchema,
  jobsSchema,
  companiesSchema,
  jobcandidatesSchema,
  tasksSchema,
  productsSchema,
  leadsSchema,
  dealsSchema,
  invoicesSchema,
  activitiesSchema,
  notesSchema,
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
  "job-candidates": {
    schema: jobcandidatesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: FileText,
    component: JobCandidateRecord,
  },
  tasks: {
    schema: tasksSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Target,
    component: TaskRecord,
  },
  products: {
    schema: productsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Package,
    component: ProductRecord,
  },
  leads: {
    schema: leadsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: TrendingUp,
    component: LeadRecord,
  },
  deals: {
    schema: dealsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: TrendingUp,
    component: DealRecord,
  },
  invoices: {
    schema: invoicesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Receipt,
    component: InvoiceRecord,
  },
  activities: {
    schema: activitiesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Calendar,
    component: ActivityRecord,
  },
  notes: {
    schema: notesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: StickyNote,
    component: NoteRecord,
  },
};

export default appObjectConfig;
