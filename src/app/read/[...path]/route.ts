import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CACHE_DIR = path.join(os.tmpdir(), 'gutenberg-html-cache');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join('/');
  const targetUrl = `https://www.gutenberg.org/${relativePath}`;
  
  // Create cache key from path
  const cacheKey = relativePath.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.html`);

  try {
    // 1. Check server-side cache
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    if (fs.existsSync(cacheFilePath)) {
      const stats = fs.statSync(cacheFilePath);
      // Cache for 24 hours server-side
      const isExpired = Date.now() - stats.mtimeMs > 24 * 3600 * 1000;
      
      if (!isExpired) {
        const content = fs.readFileSync(cacheFilePath);
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
          },
        });
      }
    }

    // 2. Fetch from Gutenberg
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch from Gutenberg: ${response.status}`, { status: response.status });
    }

    const htmlContent = await response.text();
    
    // 3. Save to server-side cache
    fs.writeFileSync(cacheFilePath, htmlContent, 'utf-8');

    // 4. Return with browser cache headers
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Proxy/Cache error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
