'use client';

import { useEffect } from 'react';
import { useRequest, useDebounce, useInterval } from 'ahooks';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/StatsCards';
import { LogTable, LogTableSkeleton } from '@/components/LogTable';
import { LogDetailDialog } from '@/components/LogDetailDialog';
import { useLogStore } from '@/store/useLogStore';
import { useLocaleStore } from '@/store/useLocaleStore';

async function fetchLogs(params: { page: number; type: string; search: string }) {
  if (!navigator.onLine) throw new Error('Network offline');
  const query = new URLSearchParams({
    page: String(params.page),
    ...(params.type && { type: params.type }),
    ...(params.search && { search: params.search }),
  });
  const res = await fetch(`/api/logs?${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function Dashboard() {
  const { filters, setFilters, setLogs, setPagination, setStats, pagination, autoRefresh, setAutoRefresh } =
    useLogStore();
  const t = useLocaleStore((s) => s.t);

  const debouncedSearch = useDebounce(filters.search, { wait: 500 });

  const { run, loading } = useRequest(
    () => fetchLogs({ page: filters.page, type: filters.type, search: debouncedSearch }),
    {
      manual: true,
      onSuccess: (data) => {
        setLogs(data.logs || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
        setStats(data.stats || { total: 0, apiErrors: 0, remoteErrors: 0 });
      },
      onError: () => {
        // Silently ignore network errors during auto-refresh
      },
    }
  );

  useEffect(() => {
    run();
  }, [filters.page, filters.type, debouncedSearch]);

  useInterval(
    () => {
      run();
    },
    autoRefresh ? 5000 : undefined
  );

  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <iconify-icon
            icon="mdi:magnify"
            width="20"
            height="20"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder={t.toolbar.search}
            className="pl-10"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
          />
        </div>

        <div className="flex items-center gap-2">
          <iconify-icon
            icon="mdi:autorenew"
            width="20"
            height="20"
            className={autoRefresh ? 'animate-spin text-primary' : 'text-muted-foreground'}
          />
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          <span className="text-sm text-muted-foreground">{t.toolbar.autoRefresh}</span>
        </div>

        <Button variant="outline" size="sm" onClick={() => run()} disabled={loading}>
          <iconify-icon icon="mdi:refresh" width="16" height="16" className="mr-1" />
          {t.toolbar.refresh}
        </Button>
      </div>

      {loading ? <LogTableSkeleton /> : <LogTable />}

      {pagination.pages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-2">
          {/* 首页 */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagination.page <= 1}
            onClick={() => setFilters({ page: 1 })}
          >
            <iconify-icon icon="mdi:chevron-double-left" width="16" height="16" />
          </Button>
          {/* 上一页 */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagination.page <= 1}
            onClick={() => setFilters({ page: pagination.page - 1 })}
          >
            <iconify-icon icon="mdi:chevron-left" width="16" height="16" />
          </Button>

          {/* 页码列表 - 移动端隐藏部分页码 */}
          {(() => {
            const pages = [];
            const current = pagination.page;
            const total = pagination.pages;
            // 移动端显示更少的页码
            let start = Math.max(1, current - 1);
            let end = Math.min(total, current + 1);

            // 确保显示3个页码
            if (end - start < 2) {
              if (start === 1) end = Math.min(total, 3);
              else start = Math.max(1, total - 2);
            }

            if (start > 1) {
              pages.push(
                <Button
                  key={1}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setFilters({ page: 1 })}
                >
                  1
                </Button>
              );
              if (start > 2)
                pages.push(
                  <span key="start-ellipsis" className="px-1 text-muted-foreground">
                    ...
                  </span>
                );
            }

            for (let i = start; i <= end; i++) {
              pages.push(
                <Button
                  key={i}
                  variant={i === current ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setFilters({ page: i })}
                >
                  {i}
                </Button>
              );
            }

            if (end < total) {
              if (end < total - 1)
                pages.push(
                  <span key="end-ellipsis" className="px-1 text-muted-foreground">
                    ...
                  </span>
                );
              pages.push(
                <Button
                  key={total}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setFilters({ page: total })}
                >
                  {total}
                </Button>
              );
            }

            return pages;
          })()}

          {/* 下一页 */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters({ page: pagination.page + 1 })}
          >
            <iconify-icon icon="mdi:chevron-right" width="16" height="16" />
          </Button>
          {/* 末页 */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters({ page: pagination.pages })}
          >
            <iconify-icon icon="mdi:chevron-double-right" width="16" height="16" />
          </Button>

          {/* 页码信息 - 移动端换行显示 */}
          <span className="text-xs sm:text-sm text-muted-foreground w-full sm:w-auto text-center sm:ml-2 mt-1 sm:mt-0">
            {t.pagination.page
              .replace('{current}', String(pagination.page))
              .replace('{total}', String(pagination.pages))}
          </span>
        </div>
      )}

      <LogDetailDialog />
    </div>
  );
}
