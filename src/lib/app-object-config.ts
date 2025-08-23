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

interface Config {
  /**
   * The schema for the object on this app
   */
  schema: z.ZodObject<z.ZodRawShape>;

  /**
   * Wether users are allowed to delete this object type
   */
  allowDelete: boolean;

  /**
   * Wether users are allowed to update this object type
   */
  allowUpdate: boolean;

  /**
   * Wether users are allowed to create this object type
   */
  allowCreate: boolean;

  /**
   * Icon for this object type
   */
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Component for rendering this object type
   */
  component: React.ComponentType<{ record: IRecord }>;

  /**
   * Readable name for the object
   */
  label: string;
}

const appObjects: Record<RecordType, Config> = {
  orders: {
    label: "Order",
    schema: ordersSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Mail,
    component: OrderRecord,
  },
  users: {
    label: "User",
    schema: usersSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: User,
    component: UserRecord,
  },
  "job-applications": {
    label: " Job Application",
    schema: jobapplicationsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Briefcase,
    component: JobApplicationRecord,
  },
  contacts: {
    label: "Contact",
    schema: contactsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Users,
    component: ContactRecord,
  },
  jobs: {
    label: "Label",
    schema: jobsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Building2,
    component: JobRecord,
  },
  companies: {
    label: "Company",
    schema: companiesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Building,
    component: CompanyRecord,
  },
  "job-candidates": {
    label: "Job Candidates",
    schema: jobcandidatesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: FileText,
    component: JobCandidateRecord,
  },
  tasks: {
    label: "Task",
    schema: tasksSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Target,
    component: TaskRecord,
  },
  products: {
    label: "Product",
    schema: productsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Package,
    component: ProductRecord,
  },
  leads: {
    label: "Lead",
    schema: leadsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: TrendingUp,
    component: LeadRecord,
  },
  deals: {
    label: "Deal",
    schema: dealsSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: TrendingUp,
    component: DealRecord,
  },
  invoices: {
    label: "Invoice",
    schema: invoicesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Receipt,
    component: InvoiceRecord,
  },
  activities: {
    label: "Activity",
    schema: activitiesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: Calendar,
    component: ActivityRecord,
  },
  notes: {
    label: "Note",
    schema: notesSchema,
    allowDelete: true,
    allowUpdate: true,
    allowCreate: true,
    icon: StickyNote,
    component: NoteRecord,
  },
};

export default appObjects;
