import { z } from 'zod';

export const ordersSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string(),
  status: z.string(),
  customerId: z.string(),
  currency: z.string(),
  totalAmount: z.number(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  fullFillmentStatus: z.string(),
  billingAddress: z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
}),
  shippingAddress: z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
}),
  lineItems: z.array(z.object({
  name: z.string(),
  productId: z.string(),
  sku: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number()
})),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string()
});

export const jobapplicationsSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  appliedAt: z.string().datetime(),
  status: z.string(),
  currentStage: z.string(),
  source: z.string(),
  rejectedTime: z.string().datetime(),
  rejectionReason: z.string(),
  creditedTo: z.string(),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string()
});

export const contactsSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  primaryEmail: z.string(),
  emails: z.array(z.object({
  value: z.string(),
  type: z.string()
})),
  primaryPhone: z.string(),
  phones: z.array(z.object({
  value: z.string(),
  type: z.string()
})),
  primaryAddress: z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
}),
  addresses: z.array(z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
})),
  stage: z.string(),
  companyName: z.string(),
  companyId: z.string(),
  ownerId: z.string(),
  jobTitle: z.string(),
  source: z.string(),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string(),
  lastActivityTime: z.string().datetime()
});

export const usersSchema = z.object({
  id: z.string(),
  title: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  primaryEmail: z.string(),
  emails: z.array(z.object({
  value: z.string(),
  type: z.string()
})),
  primaryPhone: z.string(),
  phones: z.array(z.object({
  value: z.string(),
  type: z.string()
})),
  primaryAddress: z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
}),
  addresses: z.array(z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
})),
  companyName: z.string(),
  companyId: z.string(),
  imageUrl: z.string(),
  timezone: z.string(),
  isActive: z.boolean(),
  roleId: z.string(),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string()
});

export const jobsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  code: z.string(),
  status: z.string(),
  isConfidential: z.boolean(),
  hiringManagersIds: z.array(z.string()),
  recruitersIds: z.array(z.string()),
  departmentsIds: z.array(z.string()),
  officesIds: z.array(z.string()),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string()
});

export const companiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  websiteUrl: z.string(),
  phones: z.array(z.object({
  value: z.string(),
  type: z.string()
})),
  primaryPhone: z.string(),
  description: z.string(),
  currency: z.string(),
  industry: z.string(),
  ownerId: z.string(),
  primaryAddress: z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
}),
  addresses: z.array(z.object({
  type: z.string(),
  full: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string()
})),
  numberOfEmployees: z.number(),
  createdTime: z.string().datetime(),
  createdBy: z.string(),
  updatedTime: z.string().datetime(),
  updatedBy: z.string(),
  lastActivityTime: z.string().datetime()
});
export type RecordType = "orders" | "job-applications" | "contacts" | "users" | "jobs" | "companies"