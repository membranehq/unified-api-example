import { IntegrationAppClient } from "@integration-app/sdk";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as path from "path";

const INTEGRATION_APP_WORKSPACE_KEY = "b08776e1-1943-44f4-b27e-95c5737e8ef1";
const INTEGRATION_APP_WORKSPACE_SECRET =
  "1c88a3635b2d6de684632f27b6974a049fccafdadfb08d1c968de00f01a127b2";

const getIntegrationAppAdminToken = () => {
  const tokenData = {
    isAdmin: true,
  };

  const token = jwt.sign(tokenData, INTEGRATION_APP_WORKSPACE_SECRET, {
    issuer: INTEGRATION_APP_WORKSPACE_KEY,
    expiresIn: 7200,
    algorithm: "HS512",
  });

  return token;
};

const client = new IntegrationAppClient({
  token: getIntegrationAppAdminToken(),
});

const fieldMappings = await client.fieldMappings.findAll();

const result = {};

for (const fieldMapping of fieldMappings) {
  console.log(`App Schema for ${fieldMapping.key}`);

  const appSchema = await client.fieldMapping(fieldMapping.id).getAppSchema();

  // @ts-ignore
  result[fieldMapping.key] = appSchema;
}

// Zod type generation code
interface SchemaProperty {
  type: string;
  readonly?: boolean;
  isImplied?: boolean;
  title?: string;
  format?: string;
  referenceUdm?: string;
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
}

interface SchemaObject {
  type: string;
  properties: Record<string, SchemaProperty>;
  isImplied?: boolean;
}

interface AppSchema {
  [key: string]: SchemaObject;
}

function convertPropertyToZod(
  property: SchemaProperty,
  propertyName: string
): string {
  const { type, format, readonly, items, properties } = property;

  let zodType = "";

  switch (type) {
    case "string":
      if (format === "date-time") {
        zodType = "z.string().datetime()";
      } else {
        zodType = "z.string()";
      }
      break;
    case "number":
      zodType = "z.number()";
      break;
    case "boolean":
      zodType = "z.boolean()";
      break;
    case "array":
      if (items) {
        const itemType = convertPropertyToZod(items, `${propertyName}Item`);
        zodType = `z.array(${itemType})`;
      } else {
        zodType = "z.array(z.unknown())";
      }
      break;
    case "object":
      if (properties) {
        const objectSchema = convertObjectToZod(properties);
        zodType = objectSchema;
      } else {
        zodType = "z.object({})";
      }
      break;
    default:
      zodType = "z.unknown()";
  }

  // Add optional modifier if the property is not required
  if (!property.isImplied) {
    zodType += ".optional()";
  }

  return zodType;
}

function convertObjectToZod(
  properties: Record<string, SchemaProperty>
): string {
  const schemaEntries = Object.entries(properties).map(([key, prop]) => {
    const zodType = convertPropertyToZod(prop, key);
    return `  ${key}: ${zodType}`;
  });

  return `z.object({\n${schemaEntries.join(",\n")}\n})`;
}

function generateZodTypes(schema: AppSchema): string {
  const imports = `import { z } from 'zod';\n\n`;

  const typeDefinitions = Object.entries(schema)
    .map(([typeName, typeSchema]) => {
      const zodSchema = convertObjectToZod(typeSchema.properties);
      const pascalCaseName = typeName.replace(/[\s-]+/g, ""); // Remove spaces and hyphens for valid TypeScript name

      return `export const ${pascalCaseName}Schema = ${zodSchema};\n`;
    })
    .join("\n");

  const recordTypeEnum = `export type RecordType = ${Object.keys(schema)
    .map((key) => `"${key.toLowerCase()}"`)
    .join(" | ")}`;

  return imports + typeDefinitions + recordTypeEnum;
}

// Generate Zod types from the schema
try {
  // Generate Zod types directly from the result object
  const zodTypes = generateZodTypes(result);

  // Write to output file
  const outputPath = path.join(process.cwd(), "src", "lib", "schemas.ts");
  fs.writeFileSync(outputPath, zodTypes);

  console.log("✅ Successfully generated Zod types in src/lib/schemas.ts");
  console.log("📁 Generated types for:", Object.keys(result).join(", "));
} catch (error) {
  console.error("❌ Error generating Zod types:", error);
  process.exit(1);
}

export { generateZodTypes, convertPropertyToZod, convertObjectToZod };
