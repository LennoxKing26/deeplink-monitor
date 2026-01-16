import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Log } from '@/models/Log';

export const dynamic = 'force-dynamic';

// CORS 配置 - 动态获取 origin
const getCorsHeaders = (request?: NextRequest) => {
  const origin = request?.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

    // 合并前端传来的 location 和服务端解析的 IP 信息
    const clientLocation = body.location || {};
    const serverLocation: { ip: string; city?: string; country?: string; geo?: { country?: string; city?: string } } = {
      ip,
    };

    try {
      const geoip = await import('geoip-lite');
      const geo = geoip.default.lookup(ip);
      if (geo) {
        serverLocation.geo = { country: geo.country, city: geo.city };
        serverLocation.city = geo.city;
        serverLocation.country = geo.country;
      }
    } catch {
      // geoip-lite may fail in some environments
    }

    // 合并：优先使用服务端解析的 geo 数据，保留前端传来的其他字段
    const location = { ...clientLocation, ...serverLocation };

    const log = await Log.create({ ...body, location });

    return NextResponse.json({ success: true, id: log._id }, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save log' },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
