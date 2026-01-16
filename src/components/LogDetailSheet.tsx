'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useLogStore } from '@/store/useLogStore';
import { useLocaleStore } from '@/store/useLocaleStore';

export function LogDetailSheet() {
  const { selectedLog, isSheetOpen, setSheetOpen } = useLogStore();
  const t = useLocaleStore((s) => s.t);

  if (!selectedLog) return null;

  const formatTime = (ts: number) => new Date(ts).toLocaleString();

  const highlightJson = (obj: unknown) => {
    const json = JSON.stringify(obj, null, 2);
    return json
      .replace(/"signature":\s*"([^"]+)"/g, '"signature": "<span class="text-yellow-500 font-bold">$1</span>"')
      .replace(/"rent_time":\s*(\d+)/g, '"rent_time": <span class="text-green-500 font-bold">$1</span>');
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge>{selectedLog.type}</Badge>
            <span className="text-sm text-muted-foreground">{formatTime(selectedLog.time)}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">{t.detail.message}</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{selectedLog.message}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t.detail.environment}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {selectedLog.location && (
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:map-marker" width="16" height="16" className="text-muted-foreground" />
                  <span>
                    {selectedLog.location.city}, {selectedLog.location.country}
                  </span>
                </div>
              )}
              {selectedLog.env?.timezone && (
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:clock-outline" width="16" height="16" className="text-muted-foreground" />
                  <span>{selectedLog.env.timezone}</span>
                </div>
              )}
              {selectedLog.env?.screen && (
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:monitor" width="16" height="16" className="text-muted-foreground" />
                  <span>{selectedLog.env.screen}</span>
                </div>
              )}
              {selectedLog.env?.language && (
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:translate" width="16" height="16" className="text-muted-foreground" />
                  <span>{selectedLog.env.language}</span>
                </div>
              )}
            </div>
          </div>

          {selectedLog.network && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t.detail.network}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <iconify-icon
                    icon={selectedLog.network.online ? 'mdi:wifi' : 'mdi:wifi-off'}
                    width="16"
                    height="16"
                    className={selectedLog.network.online ? 'text-green-500' : 'text-red-500'}
                  />
                  <span>{selectedLog.network.online ? t.detail.online : t.detail.offline}</span>
                </div>
                {selectedLog.network.rtt && <div>RTT: {selectedLog.network.rtt}ms</div>}
                {selectedLog.network.type && <div>Type: {selectedLog.network.type}</div>}
                {selectedLog.network.downlink && <div>Downlink: {selectedLog.network.downlink}Mbps</div>}
              </div>
            </div>
          )}

          {selectedLog.connectParams && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t.detail.connectParams}</h4>
              <pre
                className="text-xs bg-muted p-3 rounded overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: highlightJson(selectedLog.connectParams) }}
              />
            </div>
          )}

          <Accordion type="single" collapsible>
            {selectedLog.stack && (
              <AccordionItem value="stack">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="mdi:code-braces" width="16" height="16" />
                    {t.detail.stackTrace}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
                    {selectedLog.stack}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="ua">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:web" width="16" height="16" />
                  {t.detail.userAgent}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs text-muted-foreground">{selectedLog.ua}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
