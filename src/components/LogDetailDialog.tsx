'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLogStore } from '@/store/useLogStore';
import { useLocaleStore } from '@/store/useLocaleStore';

export function LogDetailDialog() {
  const { selectedLog, isSheetOpen, setSheetOpen } = useLogStore();
  const t = useLocaleStore((s) => s.t);

  if (!selectedLog) return null;

  const formatTime = (ts: number) => new Date(ts).toLocaleString();
  const isApiError = selectedLog.type === 'api_error';

  return (
    <Dialog open={isSheetOpen} onOpenChange={setSheetOpen}>
      <DialogContent className="min-w-auto md:min-w-[900px] overflow-y-scroll h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <Badge variant={isApiError ? 'destructive' : 'default'}>
              {isApiError ? t.table.apiError : t.table.rtcError}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatTime(selectedLog.time)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1  px-6 py-4 space-y-6 md:min-w-[800px] ">
          {/* 错误消息 */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <iconify-icon icon="mdi:message-alert" width="16" height="16" />
              {t.detail.message}
            </h4>
            <p className="text-sm text-red-500 dark:text-red-400 bg-muted p-3 rounded break-all">
              {selectedLog.message}
            </p>
          </div>

          {/* 环境信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 发生错误的页面 */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <iconify-icon icon="mdi:web" width="14" height="14" />
                {t.detail.errorPage}
              </div>
              <p className="text-sm break-all">{selectedLog.url}</p>
            </div>

            {/* 地域信息 */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <iconify-icon icon="mdi:map-marker" width="14" height="14" />
                {t.detail.location}
              </div>
              <p className="text-sm">
                {selectedLog.location?.city && selectedLog.location?.country
                  ? `${selectedLog.location.city}, ${selectedLog.location.country}`
                  : '--------'}
              </p>
            </div>

            {/* 网络状态 */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <iconify-icon icon="mdi:signal" width="14" height="14" />
                {t.detail.networkStatus}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <iconify-icon
                    icon={selectedLog.network?.online !== false ? 'mdi:wifi' : 'mdi:wifi-off'}
                    width="16"
                    height="16"
                    className={selectedLog.network?.online !== false ? 'text-green-500' : 'text-red-500'}
                  />
                  {selectedLog.network?.online !== false ? t.detail.online : t.detail.offline}
                </span>
                rtt:{' '}
                {selectedLog.network?.rtt && (
                  <span className="text-muted-foreground">
                    {t.detail.latency}: {selectedLog.network.rtt}ms
                  </span>
                )}
              </div>
            </div>

            {/* 设备信息 */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <iconify-icon icon="mdi:monitor-cellphone" width="14" height="14" />
                {t.detail.deviceInfo}
              </div>
              <p className="text-sm font-mono">
                {selectedLog.connectParams?.deviceId || selectedLog.device_id || '--------'}
              </p>
            </div>
          </div>

          {/* 原始参数 */}
          {selectedLog.connectParams && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <iconify-icon icon="mdi:code-json" width="16" height="16" />
                {t.detail.rawParams}
              </h4>
              <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(selectedLog.connectParams, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
