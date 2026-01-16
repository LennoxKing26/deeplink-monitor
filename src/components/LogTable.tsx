'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLogStore } from '@/store/useLogStore';
import { useLocaleStore } from '@/store/useLocaleStore';
import { ILog } from '@/models/Log';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

export function LogTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-5 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function LogTable() {
  const { logs, setSelectedLog } = useLogStore();
  const t = useLocaleStore((s) => s.t);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
      2,
      '0'
    )} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
      d.getSeconds()
    ).padStart(2, '0')}`;
  };

  const getWallet = (log: ILog) => {
    return log.connectParams?.password?.wallet || log.wallet || '--------';
  };

  const copyWallet = async (log: ILog) => {
    const wallet = log.connectParams?.password?.wallet || log.wallet;
    if (wallet) {
      await navigator.clipboard.writeText(wallet);
      toast.success(t.table.copied || 'Copied!');
    }
  };

  // 根据 category 或 type 字段判断错误类型
  const getCategoryInfo = (log: ILog) => {
    const category = (log as { category?: string }).category || log.type;
    if (category === 'remote_connection') {
      return { label: t.table.remoteError, variant: 'default' as const };
    } else if (category === 'api_error') {
      return { label: t.table.apiError, variant: 'destructive' as const };
    }
    return { label: t.table.codeError, variant: 'secondary' as const };
  };

  // 解析地域信息
  const getLocation = (log: ILog) => {
    const location = log.location as
      | { geo?: { country?: string; city?: string }; city?: string; country?: string; ip?: string }
      | undefined;
    if (!location) return '--------';

    // 检查是否为有效值
    const isValid = (val?: string) =>
      val && val !== 'unknown' && val !== '--------' && val !== '::1' && val !== '127.0.0.1';

    // 优先使用 geo 字段
    if (isValid(location.geo?.country) || isValid(location.geo?.city)) {
      const country = location.geo?.country || '';
      const city = location.geo?.city || '';
      if (isValid(country) && isValid(city)) return `${country} - ${city}`;
      return isValid(country) ? country : isValid(city) ? city : '--------';
    }

    // 回退到 city 或 country
    if (isValid(location.city)) return location.city!;
    if (isValid(location.country)) return location.country!;

    // 最后回退到 IP 地址（如果不是本地地址）
    if (location.ip && location.ip !== '::1' && location.ip !== '127.0.0.1') {
      return location.ip;
    }
    return '--------';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[130px]">{t.table.type}</TableHead>
            <TableHead>{t.table.message}</TableHead>
            <TableHead className="w-[150px]">{t.table.wallet}</TableHead>
            <TableHead className="w-[150px]">{t.table.deviceId}</TableHead>
            <TableHead className="w-[80px]">{t.table.location}</TableHead>
            <TableHead className="w-[60px]">{t.table.network}</TableHead>
            <TableHead className="w-[160px]">{t.table.time}</TableHead>
            <TableHead className="w-[100px]">{t.table.action}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log: ILog) => {
            const categoryInfo = getCategoryInfo(log);
            return (
              <TableRow key={String(log._id)} className="hover:bg-muted/50">
                <TableCell>
                  <Badge variant={categoryInfo.variant}>{categoryInfo.label}</Badge>
                </TableCell>
                <TableCell className="max-w-[250px]">
                  <span className="truncate block text-red-500 dark:text-red-400" title={log.message}>
                    {log.message}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => copyWallet(log)}
                    className="flex items-center gap-1 text-xs hover:text-primary cursor-pointer"
                    title={t.table.clickToCopy}
                  >
                    <iconify-icon icon="mdi:wallet-outline" width="14" height="14" />
                    {getWallet(log)}
                  </button>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="flex items-center gap-1">
                    <iconify-icon icon="mdi:monitor-cellphone" width="14" height="14" />
                    {log.connectParams?.deviceId || log.device_id || '--------'}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{getLocation(log)}</TableCell>
                <TableCell>
                  <iconify-icon
                    icon={log.network?.online !== false ? 'mdi:wifi' : 'mdi:wifi-off'}
                    width="18"
                    height="18"
                    className={log.network?.online !== false ? 'text-green-500' : 'text-red-500'}
                  />
                </TableCell>
                <TableCell className="text-xs ">{formatTime(log.time)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedLog(log)}
                        >
                          {t.table.viewDetail}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t.table.viewDetailTip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            );
          })}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 ">
                {t.table.noLogs}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
