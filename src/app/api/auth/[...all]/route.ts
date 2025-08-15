import { auth } from '~/lib/auth';

export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  console.log('POST request', request);
  return auth.handler(request);
}
