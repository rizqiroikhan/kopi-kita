import { NextRequest } from 'next/server';
import serverless from 'serverless-http';
import app from '@/server/app';

const handler = serverless(app);
async function forward(request: NextRequest) {
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : Buffer.from(await request.arrayBuffer());
  const expressPath = request.nextUrl.pathname.replace(/^\/api(?=\/|$)/, '');
  const response = await (handler as unknown as (req: unknown, res: unknown) => Promise<unknown>)({ method: request.method, httpMethod: request.method, url: `${expressPath}${request.nextUrl.search}`, originalUrl: `${expressPath}${request.nextUrl.search}`, path: expressPath, headers: Object.fromEntries(request.headers), body } as never, {} as never);
  const result = response as { statusCode: number; headers: Record<string, string | string[]>; body?: string; isBase64Encoded?: boolean };
  const headers = new Headers(); Object.entries(result.headers ?? {}).forEach(([key, value]) => headers.set(key, Array.isArray(value) ? value.join(', ') : value));
  const noBody = [204, 205, 304].includes(result.statusCode);
  return new Response(noBody ? null : result.body ?? null, { status: result.statusCode, headers });
}
export const GET = forward; export const POST = forward; export const PUT = forward; export const PATCH = forward; export const DELETE = forward;
