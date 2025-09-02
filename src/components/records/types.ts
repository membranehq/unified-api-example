export interface IRecord {
  fields: Record<string, unknown>;

  /**
   * Membrane mappings has these field mapped out for each records by default
   */
  id: string;
  createdAt: Date
  updatedAt: Date
}
