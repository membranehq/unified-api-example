import { NextRequest, NextResponse } from "next/server";
import { generateCustomerAccessToken } from "@/lib/integration-token";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Generate integration access token that will be used to access membrane
    const token = await generateCustomerAccessToken({
      id: user.id,
      name: user.email,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Integration token generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate integration token" },
      { status: 500 }
    );
  }
}
