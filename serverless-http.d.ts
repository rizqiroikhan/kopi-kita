declare module 'serverless-http' {
  import type { RequestHandler } from 'express';
  export default function serverless(app: unknown): RequestHandler;
}
