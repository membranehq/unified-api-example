import { NextResponse, NextRequest } from "next/server";
import { ensureAuth, getUserData } from "@/lib/ensureAuth";

export async function GET(request: NextRequest) {
  ensureAuth(request);

  try {
    const { membraneAccessToken } = getUserData(request);

    return NextResponse.json({ token: membraneAccessToken });
  } catch (error) {
    console.error("Error getting integration token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
