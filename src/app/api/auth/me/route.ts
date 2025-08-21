import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userDataCookie = request.cookies.get("app-auth");

    if (!userDataCookie?.value) {
      return NextResponse.json(
        { error: "No authentication found" },
        { status: 401 }
      );
    }

    const userData = JSON.parse(userDataCookie.value);

    if (!userData.id || !userData.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: userData.id, email: userData.email },
      message: "Authentication valid",
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}
