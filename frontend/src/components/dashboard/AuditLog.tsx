import { useEffect, useState } from 'react';
import { getAuditLogs } from '@/lib/api';

interface AuditEntry {
  id: string;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

const actionIcons: Record<string, string> = {
  USER_REGISTERED: '👤',
  ORDER_CREATED: '📦',
  ORDER_STATUS_UPDATED: '🔄',
  ORDER_DELETED: '🗑️',
  TEMPLATE_CREATED: '🎨',
  TEMPLATE_UPDATED: '✏️',
  TEMPLATE_DELETED: '🗑️',
  UPDATE_USER_ROLE: '🔑',
};

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAuditLogs(page)
      .then((res) => {
        setLogs(res.logs);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="glass-panel p-6 rounded-lg space-y-5">
      <div className="border-b border-gold-200 pb-4">
        <h2 className="text-lg font-display text-luxury-accent font-semibold">Audit Trail</h2>
        <p className="text-[10px] text-gray-500 mt-1">Complete history of admin and system actions</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100/50 rounded animate-pulse" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">No audit logs yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-luxury-dark/30 border border-gold-200/30 hover:border-gold-200 transition-colors">
              <span className="text-lg mt-0.5">{actionIcons[log.action] || '📝'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-luxury-gold uppercase tracking-wider">{log.action}</span>
                  {log.user && (
                    <span className="text-[10px] text-gray-500">by {log.user.name}</span>
                  )}
                </div>
                <p className="text-xs text-luxury-accent mt-0.5 truncate">{log.details}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-[9px] text-gray-400">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </span>
                  {log.ipAddress && (
                    <span className="text-[9px] text-gray-400">IP: {log.ipAddress}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">← Prev</button>
          <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">Next →</button>
        </div>
      )}
    </div>
  );
}
