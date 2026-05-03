import { create } from 'zustand';

interface RefreshState {
  refreshTicket: number;
  triggerRefresh: () => void;
}

export const useRefreshStore = create<RefreshState>((set) => ({
  refreshTicket: 0,
  // Setiap kali dipanggil, angka akan naik dan memicu useEffect
  triggerRefresh: () => set((state) => ({ refreshTicket: state.refreshTicket + 1 })),
}));
