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
  appObjectKey: string,
  elementType:
    | "list-action"
    | "create-action"
    | "update-action"
    | "delete-action"
    | "field-mapping"
    | "data-source"
    | "flow"
) => {
  const pluralizedAppObjectKey = getPluralForm(appObjectKey);

  switch (elementType) {
    case "list-action":
      return `list-${pluralizedAppObjectKey}`;

    // TODO: FIX---------------------
    case "create-action":
      return `create-${capitalize(pluralizedAppObjectKey)}`;
    case "update-action":
      return `update-${capitalize(pluralizedAppObjectKey)}`;
    case "delete-action":
      return `delete-${capitalize(pluralizedAppObjectKey)}`;
    // -----------------------------
    case "field-mapping":
      return `${pluralizedAppObjectKey}`;
    case "data-source":
      return `${pluralizedAppObjectKey}`;
    case "flow":
      return `receive-${appObjectKey}-events`;
  }
};
