import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Log } from '@/models/Log';

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 处理 OPTIONS 预检请求
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { device_id: { $regex: search, $options: 'i' } },
        { wallet: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [logs, total] = await Promise.all([
      Log.find(query)
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Log.countDocuments(query),
    ]);

    const stats = await Log.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          apiErrors: [{ $match: { $or: [{ type: 'api_error' }, { category: 'api_error' }] } }, { $count: 'count' }],
          remoteErrors: [
            { $match: { $or: [{ type: 'remote_connection' }, { category: 'remote_connection' }] } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return NextResponse.json(
      {
        logs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        stats: {
          total: stats[0]?.total[0]?.count || 0,
          apiErrors: stats[0]?.apiErrors[0]?.count || 0,
          remoteErrors: stats[0]?.remoteErrors[0]?.count || 0,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Logs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500, headers: corsHeaders });
  }
}
