import { getPluralForm } from "./pluralize-utils";
import { capitalize } from "./string-utils";

/**
 * Construct the key of an element based on some standard naming convention
 *
 * All elements on the membrane workspace used in the app follow this naming convention.
 *
 *
 * TODO: Update this workspace to use more sensible naming conventions.
 * e.g, it should be create-company, not create-Companies.
 */
export const getElementKey = (
  recordType: string,
  elementType:
    | "list-action"
    | "create-action"
    | "update-action"
    | "delete-action"
    | "field-mapping"
    | "data-source"
    | "flow"
) => {
  const pluralizedRecordType = getPluralForm(recordType);

  switch (elementType) {
    case "list-action":
      return `list-${pluralizedRecordType}`;

    // TODO: FIX---------------------
    case "create-action":
      return `create-${capitalize(pluralizedRecordType)}`;
    case "update-action":
      return `update-${capitalize(pluralizedRecordType)}`;
    case "delete-action":
      return `delete-${capitalize(pluralizedRecordType)}`;
    // -----------------------------
    case "field-mapping":
      return `${pluralizedRecordType}`;
    case "data-source":
      return `${pluralizedRecordType}`;
    case "flow":
      return `receive-${recordType}-events`;
  }
};
