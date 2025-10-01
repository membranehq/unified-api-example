import jwt, { Algorithm } from "jsonwebtoken";

// Your workspace credentials from Integration.app settings page
const WORKSPACE_KEY = process.env.INTEGRATION_APP_WORKSPACE_KEY;
const WORKSPACE_SECRET = process.env.INTEGRATION_APP_WORKSPACE_SECRET;

interface TokenData {
  id: string;
  name: string;
}

/**
 * Generates access token for your app user.
 * This token will be used anytime they need to access membrane
 * See https://docs.integration.app/docs/authentication#/workspace-keysecret-token-signing
 */
export function generateCustomerAccessToken(tokenData: TokenData) {
  if (!WORKSPACE_KEY || !WORKSPACE_SECRET) {
    throw new Error("Integration.app credentials not configured");
  }

  try {
    const options = {
      issuer: WORKSPACE_KEY,
      expiresIn: 7200, // 2 hours
      algorithm: "HS512" as Algorithm,
    };

    return jwt.sign(tokenData, WORKSPACE_SECRET, options);
  } catch (error) {
    console.error("Error generating integration token:", error);
    throw new Error("Failed to generate integration token");
  }
}
