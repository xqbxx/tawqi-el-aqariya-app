import { NextRequest, NextResponse } from 'next/server';

const BACKEND_HOST = 'xqbxx1-001-site1.etempurl.com';
const BACKEND_IP = '208.98.35.36';

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Strip '/api/proxy' prefix to get the real backend path
  // e.g. /api/proxy/properties => /api/properties
  // e.g. /api/proxy/hubs/property/negotiate => /hubs/property/negotiate
  let targetPath = pathname.replace('/api/proxy/', '');
  
  // Paths starting with 'hubs/' are SignalR endpoints and should NOT have /api/ prefix
  // All other paths should get the /api/ prefix
  if (targetPath.startsWith('hubs/')) {
    targetPath = '/' + targetPath;
  } else {
    targetPath = '/api/' + targetPath;
  }
  
  // Use HTTPS with the hostname - Vercel serverless functions can resolve the DNS
  // even if end-user browsers cannot (different DNS infrastructure)
  const url = `https://${BACKEND_HOST}${targetPath}${req.nextUrl.search}`;
  
  const headers = new Headers();
  // Copy only safe headers from the original request
  const safeHeaders = ['content-type', 'authorization', 'accept', 'accept-language'];
  for (const name of safeHeaders) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  // OVERRIDE the Host header so IIS knows which site to serve
  headers.set('Host', BACKEND_HOST);
  
  const fetchOptions: RequestInit = {
    method: req.method,
    headers: headers,
    redirect: 'manual'
  };
  
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const bodyText = await req.text();
    if (bodyText) {
      fetchOptions.body = bodyText;
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    const responseHeaders = new Headers();
    
    // Copy only safe response headers
    const safeResponseHeaders = ['content-type', 'cache-control', 'set-cookie'];
    for (const name of safeResponseHeaders) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    
    // Add CORS headers for SignalR negotiate requests
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Backend server is temporarily unavailable. Please try again.' }, 
      { status: 502 }
    );
  }
}
