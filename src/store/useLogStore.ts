import { create } from 'zustand';
import { ILog } from '@/models/Log';

interface LogState {
  logs: ILog[];
  selectedLog: ILog | null;
  isSheetOpen: boolean;
  filters: {
    type: string;
    search: string;
    page: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    apiErrors: number;
    remoteErrors: number;
  };
  autoRefresh: boolean;
  setLogs: (logs: ILog[]) => void;
  setSelectedLog: (log: ILog | null) => void;
  setSheetOpen: (open: boolean) => void;
  setFilters: (filters: Partial<LogState['filters']>) => void;
  setPagination: (pagination: LogState['pagination']) => void;
  setStats: (stats: LogState['stats']) => void;
  setAutoRefresh: (enabled: boolean) => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  selectedLog: null,
  isSheetOpen: false,
  filters: { type: '', search: '', page: 1 },
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
  stats: { total: 0, apiErrors: 0, remoteErrors: 0 },
  autoRefresh: false,
  setLogs: (logs) => set({ logs }),
  setSelectedLog: (selectedLog) => set({ selectedLog, isSheetOpen: !!selectedLog }),
  setSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setPagination: (pagination) => set({ pagination }),
  setStats: (stats) => set({ stats }),
  setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
}));
