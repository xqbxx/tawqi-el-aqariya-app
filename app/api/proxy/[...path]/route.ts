import { NextRequest, NextResponse } from 'next/server';

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
  // Extract path parameters and construct the target URL
  const pathname = req.nextUrl.pathname;
  // pathname is something like /api/proxy/properties
  const targetPath = pathname.replace('/api/proxy', '/api');
  
  // Use the exact IP of the SmarterASP server to bypass DNS
  // and force HTTP instead of HTTPS to avoid SSL issues with IP
  const url = `http://208.98.35.36${targetPath}${req.nextUrl.search}`;
  
  const headers = new Headers(req.headers);
  // OVERRIDE the Host header so IIS knows which site to serve
  headers.set('Host', 'xqbxx1-001-site1.etempurl.com');
  
  // Remove headers that might cause issues when proxying
  headers.delete('connection');
  headers.delete('referer');
  headers.delete('origin');
  
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
    const responseHeaders = new Headers(response.headers);
    
    // Clean up proxy headers before returning to browser
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy failed', details: String(error) }, { status: 500 });
  }
}
