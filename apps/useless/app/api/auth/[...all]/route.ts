import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { POST: originalPost, GET: originalGet } = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  try {
    console.log("[Auth] GET request to:", request.url);
    const response = await originalGet(request);
    console.log("[Auth] GET response status:", response.status);
    return response;
  } catch (error) {
    console.error("[Auth] GET error:", error);
    console.error("[Auth] Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("[Auth] Error message:", error instanceof Error ? error.message : "Unknown error");

    // Redirect to login with error details
    const errorMessage = encodeURIComponent(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Auth] POST request to:", request.url);
    const response = await originalPost(request);
    console.log("[Auth] POST response status:", response.status);
    return response;
  } catch (error) {
    console.error("[Auth] POST error:", error);
    console.error("[Auth] Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("[Auth] Error message:", error instanceof Error ? error.message : "Unknown error");

    // Redirect to login with error details
    const errorMessage = encodeURIComponent(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
  }
}
