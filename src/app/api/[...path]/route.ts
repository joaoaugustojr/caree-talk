import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Catch-all API proxy route.
 *
 * Maps any /api/* request to the matching upstream endpoint:
 *   /api/auth/login  →  {API_URL}/auth/login
 *   /api/users       →  {API_URL}/users
 *   /api/users/{id}  →  {API_URL}/users/{id}
 *
 * All HTTP methods are supported so the proxy stays generic —
 * no per-endpoint Route Handlers needed.
 *
 * Client code should use browserApi() instead of calling /api/* directly.
 * Server code should use serverApi() (direct upstream call, no loopback).
 */
async function handle(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function QUERY(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}
