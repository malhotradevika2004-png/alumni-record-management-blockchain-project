import React from 'react';
import { CheckCircle2, RefreshCw, XCircle, ShieldAlert } from 'lucide-react';

export default function RecordBadge({ status, reason, size = 'md' }) {
  const normStatus = String(status).toLowerCase();

  const isSmall = size === 'sm';
  const textClass = isSmall ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  if (normStatus === 'active' || normStatus === '0') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${textClass}`}>
        <CheckCircle2 className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
        <span>Active & Verified</span>
      </span>
    );
  }

  if (normStatus === 'updated' || normStatus === '1') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${textClass}`}>
        <RefreshCw className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
        <span>Record Updated</span>
      </span>
    );
  }

  return (
    <span
      title={reason ? `Revocation Reason: ${reason}` : 'Record Revoked'}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${textClass}`}
    >
      <XCircle className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
      <span>Revoked</span>
    </span>
  );
}

