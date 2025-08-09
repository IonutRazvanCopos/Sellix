import { useEffect, useState, useCallback } from 'react';
import { AdminAPI } from '../api/adminApi';
import { Listing } from '../types';

export function useAdminListings() {
  const [pending, setPending] = useState<Listing[]>([]);
  const [hidden, setHidden] = useState<Listing[]>([]);

  const refresh = useCallback(async () => {
    const [p, h] = await Promise.all([
      AdminAPI.getPending(),
      AdminAPI.getHidden()
    ]);
    setPending(p.data);
    setHidden(h.data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const approve = async (id: number) => { await AdminAPI.approve(id); await refresh(); };
  const hide = async (id: number) => { await AdminAPI.hide(id); await refresh(); };
  const unhide = async (id: number) => { await AdminAPI.unhide(id); await refresh(); };

  return { pending, hidden, approve, hide, unhide };
}