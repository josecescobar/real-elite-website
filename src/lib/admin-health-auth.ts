import { createHash, timingSafeEqual } from 'crypto';
import { env } from '@/lib/env';

function hash(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

/** Detailed health data is available only through the admin Bearer credential. */
export function hasAdminHealthAuthorization(request: Request): boolean {
  const adminKey = env.adminToolsKey();
  const authorization = request.headers.get('authorization');
  if (!adminKey || !authorization?.toLowerCase().startsWith('bearer ')) return false;

  const provided = authorization.slice(7).trim();
  return provided.length > 0 && timingSafeEqual(hash(provided), hash(adminKey));
}
