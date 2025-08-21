export interface IRecord {
  id: string;
  data: Record<string, unknown>;

  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
