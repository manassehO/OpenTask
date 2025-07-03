import { auth } from "~/lib/auth";

export async function GET() {
  return new Response("Hello from test route");
}

/* export async function GET(request: Request) {
  return auth.handler(request);
} */

export async function POST(request: Request) {
  return auth.handler(request);
}
